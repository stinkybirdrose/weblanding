<?php

namespace Stripe\HttpClient;

use Stripe\Stripe;
use Stripe\Error;
use Stripe\Util;

// cURL constants are not defined in PHP < 5.5

// @codingStandardsIgnoreStart
// PSR2 requires all constants be upper case. Sadly, the CURL_SSLVERSION
// constants do not abide by those rules.

// Note the values 1 and 6 come from their position in the enum that
// defines them in cURL's source code.
// if (!defined('CURL_SSLVERSION_TLSv1')) {
//     define('CURL_SSLVERSION_TLSv1', 1);
// }
// if (!defined('CURL_SSLVERSION_TLSv1_2')) {
//     define('CURL_SSLVERSION_TLSv1_2', 6);
// }
// @codingStandardsIgnoreEnd

class CurlClient implements ClientInterface {

	private static $instance;

	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	protected $defaultOptions;

	protected $userAgentInfo;

	/**
	 * CurlClient constructor.
	 *
	 * Pass in a callable to $defaultOptions that returns an array of CURLOPT_* values to start
	 * off a request with, or an flat array with the same format used by curl_setopt_array() to
	 * provide a static set of options. Note that many options are overridden later in the request
	 * call, including timeouts, which can be set via setTimeout() and setConnectTimeout().
	 *
	 * Note that request() will silently ignore a non-callable, non-array $defaultOptions, and will
	 * throw an exception if $defaultOptions returns a non-array value.
	 *
	 * @param array|callable|null $defaultOptions
	 */
	public function __construct( $defaultOptions = null ) {
		$this->defaultOptions = $defaultOptions;
		$this->initUserAgentInfo();
	}

	public function initUserAgentInfo() {
		$curlVersion         = curl_version();
		$this->userAgentInfo = array(
			'httplib' => 'curl ' . $curlVersion['version'],
			'ssllib'  => $curlVersion['ssl_version'],
		);
	}

	public function getDefaultOptions() {
		return $this->defaultOptions;
	}

	public function getUserAgentInfo() {
		return $this->userAgentInfo;
	}

	// USER DEFINED TIMEOUTS

	const DEFAULT_TIMEOUT         = 80;
	const DEFAULT_CONNECT_TIMEOUT = 30;

	private $timeout        = self::DEFAULT_TIMEOUT;
	private $connectTimeout = self::DEFAULT_CONNECT_TIMEOUT;

	public function setTimeout( $seconds ) {
		$this->timeout = (int) max( $seconds, 0 );
		return $this;
	}

	public function setConnectTimeout( $seconds ) {
		$this->connectTimeout = (int) max( $seconds, 0 );
		return $this;
	}

	public function getTimeout() {
		return $this->timeout;
	}

	public function getConnectTimeout() {
		return $this->connectTimeout;
	}

	// END OF USER DEFINED TIMEOUTS

	public function request( $method, $absUrl, $headers, $params, $hasFile ) {
		$method = strtolower( $method );

		$opts = array();
		if ( is_callable( $this->defaultOptions ) ) { // call defaultOptions callback, set options to return value
			$opts = call_user_func_array( $this->defaultOptions, func_get_args() );
			if ( ! is_array( $opts ) ) {
				throw new Error\Api( 'Non-array value returned by defaultOptions CurlClient callback' );
			}
		} elseif ( is_array( $this->defaultOptions ) ) { // set default curlopts from array
			$opts = $this->defaultOptions;
		}

		if ( $method == 'get' ) {
			if ( $hasFile ) {
				throw new Error\Api(
					'Issuing a GET request with a file parameter'
				);
			}
			$opts['method'] = 'GET';
			if ( count( $params ) > 0 ) {
				$encoded = Util\Util::urlEncode( $params );
				$absUrl  = "$absUrl?$encoded";
			}
		} elseif ( $method == 'post' ) {
			$opts['method'] = 'POST';
			$opts['body'] = $hasFile ? $params : Util\Util::urlEncode( $params );
		} elseif ( $method == 'delete' ) {
			$opts['method'] = 'DELETE';
			if ( count( $params ) > 0 ) {
				$encoded = Util\Util::urlEncode( $params );
				$absUrl  = "$absUrl?$encoded";
			}
		} else {
			throw new Error\Api( "Unrecognized method $method" );
		}

		// sending an empty `Expect:` header.
		array_push( $headers, 'Expect: ' );

		$absUrl = Util\Util::utf8( $absUrl );
		$opts['httpversion'] = '1.1';
		$opts['timeout'] = $this->timeout;
		
		if ( ! Stripe::$verifySslCerts ) {
			$opts['sslverify'] = false;
		}

		$opts['headers'] = $headers;
		if ( $method == 'get' ) {
			$rbody = wp_remote_get($absUrl, $opts);
		} elseif ( $method == 'post' ) {
			$rbody = wp_remote_post($absUrl, $opts);
		} elseif ( $method == 'delete' ) {
			$rbody = wp_remote_request($absUrl, $opts);
		}

		if ( is_wp_error ($rbody) ) {
			$opts['sslverify'] = true;
			array_push(
				$headers,
				'X-Stripe-Client-Info: {"ca":"using Stripe-supplied CA bundle"}'
			);
			$args['sslcertificates'] = self::caBundle();
			$opts['headers'] = $headers;

			if ( $method == 'get' ) {
				$rbody = wp_remote_get($absUrl, $opts);
			} elseif ( $method == 'post' ) {
				$rbody = wp_remote_post($absUrl, $opts);
			} elseif ( $method == 'delete' ) {
				$rbody = wp_remote_request($absUrl, $opts);
			}
		}

		if ( is_wp_error ($rbody) ) {
			$this->handleCurlError( $absUrl, $rbody->get_error_code(),  $rbody->get_error_message());
		}

		$rcode = $rbody['response']['code'];
		$rheaders = array();
		if( !empty($rbody['headers']) ){
			foreach ($rbody['headers'] as $key => $value) {
				$rheaders[ trim( $key ) ] = trim( $value );
			}
		};
				
		return array( $rbody, $rcode, $rheaders );
	}

	/**
	 * @param number $errno
	 * @param string $message
	 * @throws Error\ApiConnection
	 */
	private function handleCurlError( $url, $errno, $message ) { // Todo: Need to update switch cases according to error response
		switch ( $errno ) {
			case CURLE_COULDNT_CONNECT:
			case CURLE_COULDNT_RESOLVE_HOST:
			case CURLE_OPERATION_TIMEOUTED:
				$msg = "Could not connect to Stripe ($url).  Please check your "
				 . 'internet connection and try again.  If this problem persists, '
				 . "you should check Stripe's service status at "
				 . 'https://twitter.com/stripestatus, or';
				break;
			case CURLE_SSL_CACERT:
			case CURLE_SSL_PEER_CERTIFICATE:
				$msg = "Could not verify Stripe's SSL certificate.  Please make sure "
				 . 'that your network is not intercepting certificates.  '
				 . "(Try going to $url in your browser.)  "
				 . 'If this problem persists,';
				break;
			default:
				$msg = 'Unexpected error communicating with Stripe.  '
				 . 'If this problem persists,';
		}
		$msg .= ' let us know at support@stripe.com.';

		$msg .= "\n\n(Network error [errno $errno]: $message)";
		throw new Error\ApiConnection( $msg );
	}

	private static function caBundle() {
		return dirname( __FILE__ ) . '/../../data/ca-certificates.crt';
	}
}
