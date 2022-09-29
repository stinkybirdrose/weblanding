<?php

namespace WfpFundraising;

use WfpFundraising\Apps\Donation_Cpt;
use WfpFundraising\Apps\Fundraising_Cpt;
use WfpFundraising\Apps\Key;
use WfpFundraising\Core\Donation_Report;


/**
 * Class Plugin
 *
 * @package WfpFundraising
 */
final class Plugin {

	private static $instance;

	private $base_location;
	private $base_directory;


	public function __construct( $loc ) {

		$this->base_location = plugin_basename( $loc );

		$this->base_directory = dirname( $this->base_location );
	}


	/**
	 * Singleton design pattern
	 *
	 * @since 1.1.20
	 *
	 * @param $base
	 *
	 * @return Plugin
	 */
	public static function instance( $base ) {

		if ( ! self::$instance ) {
			self::$instance = new self( $base );
		}

		return self::$instance;
	}


	public function plugin_url() {
		return trailingslashit( plugin_dir_url( __FILE__ ) );
	}


	public function plugin_dir() {
		return trailingslashit( plugin_dir_path( __FILE__ ) );
	}


	public function views_dir() {
		return $this->plugin_dir() . 'views/';
	}


	public function init() {

		add_filter( 'the_content', array( $this, 'wfp_content_replace_for_invoice_page' ) );

		add_filter( 'plugin_action_links_' . $this->base_location, array( $this, 'wfp_action_links' ) );

		add_filter( 'post_row_actions', array( $this, 'add_donations_link' ), 10, 2 );

		/**
		 * This will hold every info related to individual
		 */
		Donation_Cpt::instance()->init();

		Donation_Report::instance()->init();
	}


	public function wfp_action_links( $links ) {
		$links[] = '<a href="' . admin_url( 'edit.php?post_type=wp-fundraising&page=settings' ) . '"> ' . __( 'Settings', 'wp-fundraising' ) . '</a>';
		$links[] = '<a href="' . admin_url( 'post-new.php?post_type=wp-fundraising' ) . '" target="_blank">' . __( 'Add', 'wp-fundraising' ) . '</a>';

		return $links;
	}


	public function wfp_content_replace_for_invoice_page( $content ) {

		$slug      = Key::SLUG_INVOICE_PAGE;
		$curr_slug = get_post_field( 'post_name' );

		if ( $slug == $curr_slug ) {

			ob_start();

			include $this->views_dir() . 'admin/view-invoice.php';

			$content = ob_get_contents();

			ob_end_clean();
		}

		return $content;
	}

	public function add_donations_link( $actions, $post ) {

		if ( $post->post_type == Fundraising_Cpt::TYPE ) {

			$url = admin_url( 'edit.php?post_type=' . Fundraising_Cpt::TYPE . '&page=donations&donation_id=' . $post->ID );

			$trash = $actions['trash'];

			unset( $actions['trash'] );

			$actions['wfp_donations'] = '<a href="' . $url . '" title="check all donations" target="_blank" >' . esc_html__( 'Donations', 'wp-fundraising' ) . '</a>';
			$actions['trash']         = $trash;

		}

		return $actions;
	}
}
