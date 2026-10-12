<?php
// Copy to config.php and fill in. Never commit config.php.
return [
    // Long random string used to sign download links (e.g. bin2hex(random_bytes(32)))
    'link_secret'    => 'CHANGE_ME_LONG_RANDOM_STRING',
    // FastSpring > Developer Tools > Webhooks > HMAC SHA256 secret
    'webhook_secret' => 'CHANGE_ME_FASTSPRING_HMAC_SECRET',
    // Folder OUTSIDE the public web root that holds the sellable ZIPs
    'files_dir'      => '/home/youruser/private_files',
    'site_url'       => 'https://3dluxurystudio.com',
    'from_email'     => 'orders@3dluxurystudio.com',
    'link_ttl'       => 72 * 3600,
    // FastSpring product path => file name inside files_dir
    'products'       => [
        'figma-kitchen-ui-kit'   => 'figma-kitchen-ui-kit.zip',
        'psd-living-room-pack'   => 'psd-living-room-pack.zip',
        'illustrations-bedroom'  => 'illustrations-bedroom.zip',
    ],
];
