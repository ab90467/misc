// gulpfile.js :: require socket.io
var io = require('socket.io')();

// gulpfile.js :: spin up server.js 
gulp.task('server', function() {
    const serverPort = config.serverPort ? config.serverPort : (function() {
        gutil.log('Error: ', gutil.colors.magenta('missing defined port number for server ( gulp-config.js :: serverPort)'), '\n');
        process.exit();
    })();
    spawn('node', ['server.js'], { stdio: 'inherit' });
    gulp.start('io:livereload');
});

// gulpfile.js :: start up io server on own port
gulp.task('io:livereload', function() {
    if (config.liveReloadPort) {
        io.listen(config.liveReloadPort);
        gutil.log('starting reload on port: ' + gutil.colors.magenta(config.liveReloadPort));
    }
});

// gulpfile.js :: example on when reload demopage
gulp.task('build-js', ['lint', 'clean-js'], function() {
  ....
  .pipe(gulp.dest(path.join(config.distRoot, config.dist.jsPath))).on('error', gutil.log).on('end', function() {
        if (io && io.local) {
           gutil.log('reload demopage')
           io.local.emit('reload', 'page');
       }
   });
});

// demopage.html :: include javascript inline or own file
(function(port){
    var s = document.createElement('script');
    s.setAttribute('src', 'http://localhost:' + port + '/socket.io/socket.io.js');
    s.onload = function() {
        var socketClient = io.connect('localhost:' + port, {
            secure: false,
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity
        });
        socketClient.on('reload', function() {
            window.location.reload();
        });
    }
    document.head.appendChild(s);
})(config.liveReloadPort);



