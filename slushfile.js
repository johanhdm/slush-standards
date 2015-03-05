/*
 * slush-standards
 * https://github.com/johanhdm/slush-standards
 *
 * Copyright (c) 2015, Johan Halvarsson de Maar
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    _ = require('underscore.string'),
    path = require('path'),
    inquirer = require('inquirer');

function format(string) {
    var username = string.toLowerCase();
    return username.replace(/\s/g, '');
}

var defaults = (function () {
    var workingDirName = path.basename(process.cwd()),
      homeDir, osUserName, configFile, user;

    if (process.platform === 'win32') {
        homeDir = process.env.USERPROFILE;
        osUserName = process.env.USERNAME || path.basename(homeDir).toLowerCase();
    }
    else {
        homeDir = process.env.HOME || process.env.HOMEPATH;
        osUserName = homeDir && homeDir.split('/').pop() || 'root';
    }

    configFile = path.join(homeDir, '.gitconfig');
    user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    }

    return {
        appName: workingDirName,
        userName: osUserName || format(user.name || ''),
        authorName: user.name || '',
        authorEmail: user.email || ''
    };
})();

gulp.task('default', function (done) {
    var prompts = [
      {
          name: 'clientName',
          message: 'What is the name of the client?',
          default: defaults.clientName
    }, {
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        name: 'appDescription',
        message: 'What is the description?'
    }, {
        name: 'appVersion',
        message: 'What is the version of your project?',
        default: '0.1.0'
    }, {
        name: 'authorName',
        message: 'What is the author name?',
        default: defaults.authorName
    }, {
        name: 'authorEmail',
        message: 'What is the author email?',
        default: defaults.authorEmail
    }, {
        name: 'userName',
        message: 'What is the github username?',
        default: defaults.userName
    },
    {
      type: 'confirm',
      name: 'jquery',
      message: 'Do you want to use jQuery?', default: true
    },
    {
      type: 'confirm',
      name: 'bootstrapjs',
      message: 'Do you want to use Bootstrap JS?', default: true
    },

    {
      type: 'confirm',
      name: 'angular',
      message: 'Do you want to use AngularJS?', default: false
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.appNameSlug = _.slugify(answers.appName);
            answers.clientNameSlug = _.slugify(answers.clientName);

            var files = [__dirname + '/templates/**'];
            if (!answers.bootstrapjs && !answers.jquery){
              files.push( '!' +  __dirname + '/templates/Static/Source/js/lib/jquery-1.11.2/**/*.*');
              files.push( '!' +  __dirname + '/templates/Static/Source/js/lib/bootstrap-3.3.2/**/*.*');
            }
            else if(!answers.bootstrap && answers.jquery){
              files.push( '!' +  __dirname + '/templates/Static/Source/js/lib/bootstrap-3.3.2/**/*.*');
            }
            if (!answers.angular){
              files.push( '!' +  __dirname + '/templates/Static/Source/js/lib/angularjs-1.3.14/**/*.*');
            }

            gulp.src(files)
              .pipe(conflict('./'))
              .pipe(gulp.dest('./' + answers.appName))
              .on('end', function(){
                templating();
              });

              function templating(){
                gulp.src([__dirname + '/templates/**/package.json', __dirname + '/templates/**/*.html', __dirname + '/templates/**/*.md'])
                  .pipe(template(answers))
                  .pipe(conflict('./'))
                  .pipe(gulp.dest('./' + answers.appName))
                  .pipe(install())
                  .on('end', function () {
                    done();
                  });
              }
        }
    );
});
