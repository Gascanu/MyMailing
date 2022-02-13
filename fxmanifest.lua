fx_version 'bodacious'
game 'gta5'

ui_page 'html/index.html'

files {
  'html/*',
  'html/css/style.css',
  'html/css/animation.css',
  'html/css/fontawesome.css',

  'html/img/logo.png',
  'html/img/face.png',

  'config.js',
  
  'html/js/script.js',
  'html/js/jquery-3.5.1.min.js',

  'html/webfonts/BebasNeue/BebasNeue-Regular.eot',
  'html/webfonts/BebasNeue/BebasNeue-Regular.otf',
  'html/webfonts/BebasNeue/BebasNeue-Regular.ttf',
  'html/webfonts/BebasNeue/BebasNeue-Regular.woff',
  'html/webfonts/BebasNeue/BebasNeue-Regular.woff2',

  'html/webfonts/Icons/fa-brands-400.eot',
  'html/webfonts/Icons/fa-brands-400.svg',
  'html/webfonts/Icons/fa-brands-400.tff',
  'html/webfonts/Icons/fa-brands-400.woff',
  'html/webfonts/Icons/fa-brands-400.woff2',

  'html/webfonts/Icons/fa-regular-400.eot',
  'html/webfonts/Icons/fa-regular-400.svg',
  'html/webfonts/Icons/fa-regular-400.tff',
  'html/webfonts/Icons/fa-regular-400.woff',
  'html/webfonts/Icons/fa-regular-400.woff2',

  'html/webfonts/Icons/fa-solid-900.eot',
  'html/webfonts/Icons/fa-solid-900.svg',
  'html/webfonts/Icons/fa-solid-900.tff',
  'html/webfonts/Icons/fa-solid-900.woff',
  'html/webfonts/Icons/fa-solid-900.woff2',
}

server_scripts {
  '@mysql-async/lib/MySQL.lua',
  'config.lua',
  'server.lua',
}

client_scripts {
  'config.lua',
  'client.lua',
}