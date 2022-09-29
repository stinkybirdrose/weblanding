<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'weblanding' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'FKJsM!)+,xl;.9LU@M#8}m0i@!TQAfqr)QpVz>~p!wh0PKz[(@){/$7%Eu,T k5Z' );
define( 'SECURE_AUTH_KEY',  'Zft~IciNK^8QQ8IPn@0%16<o9mp^i*yLL53(^ugK1&K{my_:8WS41 kE%`s#gEJ.' );
define( 'LOGGED_IN_KEY',    '&3l&@5n[C4`H8~aN/616qenVQekL0A.DUVxmu;~40m>ErNy BL>N&@=Mt%,O_bgo' );
define( 'NONCE_KEY',        'U6-p.Oht|WOUN+$F(vX]H/#4XC$_Mm$I*kuAo`^FCyyFc[`2kCNtfm3B~ mtB3iE' );
define( 'AUTH_SALT',        'B0CWeJ9/4{a=p2;;Fes-JUs<E[zF7rt?AdVZoAJ8v7%j`fhkT)`1W1#rXTj1ePPg' );
define( 'SECURE_AUTH_SALT', 'Z0`pd)i8C}hL;Ksk7Xe.CD1B_8j)cB#Ha DB4(&T9dvJlJO4bcW U1}].Ep5THI%' );
define( 'LOGGED_IN_SALT',   '.j,pHpnKXnn FOfw/pe58,kvFzkdIJc7z1r0ZzKNH_l+fhnO_mc@;Kt8Gox4{.A6' );
define( 'NONCE_SALT',       '<~7WQils;`WfQQWXD~7B++:@z0B)yFM5)pTS^*}3Pm|=u/83TX;X]`3{a4Jk1T[E' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
