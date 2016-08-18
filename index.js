#! /usr/bin/env node

var selenium = require('selenium-standalone')
var service = require('os-service')
var fs = require('fs')

var file = process.argv[1]
var option = process.argv[2]
var mode = process.argv[3]

var hubConfig = process.env.SELENIUM_SERVICE_HUB_JSON

function install(cb) {
    selenium.install({ logger: console.log }, cb)
}

function start(mode, cb) {
    var args = {
        server: [],
        hub: hubConfig ? ['-hubConfig', hubConfig] : [],
        node: []
    }[mode]
    selenium.start({ seleniumArgs: args }, cb)
}

function stop(child) {
    child.kill()
}

function usage() {
    console.log('to install the services:')
    console.log('  node ' + file + ' --add')
    console.log('')
    console.log('to uninstall the services:')
    console.log('  node ' + file + ' --remove')
    console.log('')
    console.log('to start a service:')
    console.log('  node ' + file + ' --run [node|hub|server]')
    console.log('')
    console.log('for hubs, the environment variable SELENIUM_SERVICE_HUB_JSON will be passed to selenium as -hubConfig')
}

function error(err) {
    console.trace(err)
    process.exit(1)
}

switch (option) {
case "--add": 
    install(function (err, data) {
        if (err) return error(err)
        service.add("selenium-server", { programArgs: ["--run", "server"] }, function (err) { 
            if (err) return error(err);
        })
        service.add("selenium-grid-hub", { programArgs: ["--run", "hub"] }, function (err) { 
            if (err) return error(err);
        })
        service.add("selenium-grid-node", { programArgs: ["--run", "node"] }, function (err) { 
            if (err) return error(err);
        })
    })
    break
case "--remove":
    service.remove("selenium-server", function (err) { 
       if (err) return error(err)
    })
    service.remove("selenium-grid-hub", function (err) { 
       if (err) return error(err)
    })
    service.remove("selenium-grid-node", function (err) { 
       if (err) return error(err)
    })
    break
case "--run":
    if (!mode) { usage(); break }
    
    var logStream = fs.createWriteStream("selenium-service." + mode + ".log")
    var child = undefined
    
    service.run(logStream, function () {
        if (child)
            stop(child)
        service.stop(0)
    })
    
    start(mode, function (err, _child) {
        if (err) return error(err)
        child = _child
        child.stderr.pipe(logStream)
    })
    break
default:
    usage()
}
