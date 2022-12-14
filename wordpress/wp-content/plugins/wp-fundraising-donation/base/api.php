<?php

namespace WfpFundraising\Base;

defined( 'ABSPATH' ) || exit;

abstract class Api {

	public string $prefix = '';
	public string $param  = '';
	public $request       = null;


	abstract public function config();


	public function __construct() {
		$this->config();
		$this->init();
	}


	public function init() {
		add_action(
			'rest_api_init',
			function () {
				register_rest_route(
					untrailingslashit( \WFP_Fundraising::PREFIX . '/v2/' . $this->prefix ),
					'/(?P<action>\w+)/' . ltrim( $this->param, '/' ),
					array(
						'methods'             => \WP_REST_Server::ALLMETHODS,
						'callback'            => array( $this, 'action' ),
						'permission_callback' => '__return_true',
					)
				);
			}
		);
	}


	public function action( $request ) {
		$this->request = $request;
		$action_class  = strtolower( $this->request->get_method() ) . '_' . sanitize_key( $this->request['action'] );

		if ( method_exists( $this, $action_class ) ) {
			return $this->{$action_class}();
		}

		return null;
	}

}
