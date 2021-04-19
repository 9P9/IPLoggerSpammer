const request = require('request');
const prompt = require('prompt');
const colors = require('colors');
const chalk = require('chalk');
const nodeUrlExpand = require('node-url-expand');
var proxyChecker = require('proxy-checker');
const fs = require('fs');
var ping = require('jjg-ping');
const ProxyAgent = require('proxy-agent');
var sleep = require('system-sleep');
var proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');
var agents = fs.readFileSync('agents.txt', 'utf-8').replace(/\r/gi, '').split('\n');
var referrer = fs.readFileSync('referrer.txt', 'utf-8').replace(/\r/gi, '').split('\n');
var fail = 0;
var success = 0; 
var ratelimit = 0; 
var test = ""; 
var count = 0; 
var proxysite = "https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=10000&country=all&ssl=all&anonymity=all";

function write(content, file) {
    fs.appendFile(file, content, function(err) {
    });
}
//process.on('uncaughtException', e => {});
//process.on('uncaughtRejection', e => {});
//process.warn = () => {};
//console.warn = function() {};

function send(type, link) {
	var useragent = agents[Math.floor(Math.random() * agents.length)];
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
	var agent = new ProxyAgent(`${type}://` + proxy);
	let referer = referrer[Math.floor(Math.random() * referrer.length)];
    request.get(link, {
        json: true,
        agent,
        headers: {
			'user-agent': useragent, 
			'referer': referer,
		},
        body: {}
    }, (err, res, body) => {
        if (res && res.statusCode === 200) {
            console.log(chalk.red("[Attack]") + chalk.green (" Success: " + link + " flooded | Referrer " + referer));
			success++;
		}
		else if (res && res.statusCode === 429) {
            console.log(chalk.hex("#ffa500")("[RATELIMIT] Failed " + link + " not flooded | Error Code: " + res.statusCode));
			fail++; 
			ratelimit++; 
		}
		else if (res && res.statusCode === 403) {
            console.log(chalk.hex("#a500ff")("[PROXY_ERROR] Failed " + link + " not flooded | Error Code: " + res.statusCode));
			fail++; 
			
		}
		else{
               //console.log(chalk.red("[Attack] Failed " + link + " not flooded | Error Code: " + res.statusCode));
			   return;
               fail++;
			 }
			process.title = `[313] | IP Logger Spammer | Success: ${success} | Fail: ${fail} | Proxies ${proxies.length} | RateLimit ${ratelimit}`; 
       });
};
function sleep(n) {
  msleep(n*1000);
}

function checker(url) {
	count++
	nodeUrlExpand(url, function (err, url) {
		
		console.log(chalk.hex("#0080ff")("[REDIRECT] " + url)); 
		if(count == 5)
		{
			process.exit();
		}
		else{
			checker(url);
		}
	})
};


function getproxies(){
			request.get(proxysite, (err, res, body) =>
			{
				console.log("[INFO] Scraping Proxies"); 
				proxies = body.split('/n');
				proxys = proxies.toString();
				setTimeout(() => scrapeProxies(), 10 * 100 * 1000);
				fs.writeFile('proxies.txt', proxys, function (err) {
				})
				console.log(`[INFO] Proxies Scraped! You now have proxies`); 
				console.log("[WARN] Please Restart Application Using Ctrl C"); 
			
		
			});
};


function proxychecker(){
		proxyChecker.checkProxiesFromFile(
		'./proxies.txt',
		{
			url: 'http://www.example.com',
			regex: /Example Domain/
		},
		function(host, port, ok, statusCode, err) {
			if(statusCode === 200){
				console.log(chalk.green(host + ':' + port + ' ' + ok + ' (status: ' + statusCode + ')'));
					write(host + ':' + port + "\n", "proxies/working.txt");
			}
			else{
				console.log(chalk.red(host + ':' + port + ' ' + ok + ' (status: ' + statusCode + ')'));
				write(host + ':' + port + "\n", "proxies/notworking.txt");
			}
		}
	);
};


function pinger(host){ 
	ping.system.ping(host, function(latency, status) {
		if (status) {
			console.log(chalk.hex("#66ff00")(host + " is reachable (" + latency + " ms ping)."));
		}
		else {
			console.log(chalk.hex("#ae0700")(host + " is down."));
		}
	});
};

function range(ip){ 
		ping.system.ping(ip, function(latency, status) {
			if (status) {
				console.log(chalk.hex("#66ff00")(ip + " is reachable (" + latency + " ms ping)."));
				write(ip + " is reachable (" + latency + " ms ping)." + "\n", "ips/range.txt");
				process.title = `[313] | IP Range | Open: ${success++} | Closed: ${fail} | Proxies ${proxies.length} | RateLimit ${ratelimit}`; 
			}
			else {
				console.log(chalk.hex("#ae0700")(ip + " is down."));
				write(ip + " is down." + "\n", "ips/range.txt");
				process.title = `[ILF] | IP Range | Open: ${success} | Closed: ${fail++} | Proxies ${proxies.length} | RateLimit ${ratelimit}`; 
			}
		});
};
function whois(ip){ 
	prompt.start();	
			prompt.get(['ip'], function(err, result) {
			console.log('');		
			const ip = result.ip;	
			
	request.get(`http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`, (err, res, body) =>
	{
		let obj = JSON.parse(body); 
		console.log(obj);
		whois(); 
	})
	})
	
}

//Startup Code
	process.title = `[313] | IP Logger Spammer | Success: ${success} | Fail: ${fail} | Proxies ${proxies.length}`; 
	console.log(chalk.hex("#DC143C")("				▄▄▌  ▄• ▄▌ ▄▄· ▪    .▄▄ ·   ▪   ▄▄▄·  ▄▄▄▄▄            ▄▄▌ "));
	console.log(chalk.hex("#DC143C")("				██•  █▪██▌▐█ ▌▪██   ▐█ ▀.   ██ ▐█ ▄█  •██   ▄█▀▄  ▄█▀▄ ██•  "));
	console.log(chalk.hex("#DC143C")("				██▪  █▌▐█▌██ ▄▄▐█·  ▄▀▀▀█▄  ▐█· ██▀·   ▐█.▪▐█▌.▐▌▐█▌.▐▌██▪  "));
	console.log(chalk.hex("#DC143C")("				▐█▌▐▌▐█▄█▌▐███▌▐█▌  ▐█▄▪▐█  ▐█▌▐█▪·•   ▐█▌·▐█▌.▐▌▐█▌.▐▌▐█▌▐▌"));
	console.log(chalk.hex("#DC143C")("				.▀▀▀  ▀▀▀ ·▀▀▀ ▀▀▀   ▀▀▀▀   ▀▀▀.▀      ▀▀▀  ▀█▄▀▪ ▀█▄▀▪.▀▀▀ "));
	console.log(chalk.red.underline("							Coded By Luci"));
	
	
	prompt.start();	
		console.log("");
		console.log(chalk.hex("ff674d")("[1] Link Expander")); 
		console.log(chalk.hex("ff674d")("[2] IP Logger Fucker")); 
		console.log(chalk.hex("ff674d")("[3] Proxy Scraper")); 
		console.log(chalk.hex("ff674d")("[4] Proxy Checker")); 
		console.log(chalk.hex("ff674d")("[5] IP/Site Pinger")); 
		console.log(chalk.hex("ff674d")("[6] IP Range (INPUT: 197.0.0)")); 
		console.log(chalk.hex("ff674d")("[7] IP Lookup")); 
		console.log(chalk.hex("ff674d")("[8] Exit")); 		
		console.log("");
		prompt.get(['options'], function(err, result) {
		console.log('');
		var options = result.options;
		console.log(""); 
		
		switch(options) {
			case "1":
				prompt.start();	
				
				prompt.get(['URL'], function(err, result) {
				console.log('');
				var url = result.URL;
				console.log("");
				console.log(chalk.yellow("[INFO] Checking for all possible redirects")); 
				checker(url);
				})
		
				break;
				
			case "2":
				prompt.start();	
				console.log(chalk.inverse("[INFO] Press Corrosponding Number to Select Proxy Type! ")); 
			console.log(`[1] https
[2] socks4
[3] socks5`); 
			prompt.get(['type'], function(err, result) {
			console.log('');
			var type = result.type;
			switch(type) {
				case "1": 
					var type = "https";
					break
				case "2":
					var type = "socks4";
					break
				case "3":
					var type = "socks5";
					break
				default:
					var type = "https";
					break
			}
				prompt.get(['link'], function(err, result) {
				console.log('');
				console.log(chalk.red('Ip Logger Link '));
				
				const link = result.link;
				console.log("");
				proxies.forEach(proxy => send(type, link));
				});
			})
				break;
				
			case "3":
				getproxies(); 
				break;
				
			case "4":
				proxychecker(); 
				break;
				
			case "5":
				prompt.start();	
				prompt.get(['pinger'], function(err, result) {
				console.log('');			
				const host = result.pinger;
				console.log("");
				while(true){
					pinger(host); 
					sleep(500);
				}
				})
				break;
				
			case "6":
				prompt.start();	
				prompt.get(['range'], function(err, result) {
				console.log('');			
				const host = result.range;
					for (i = 0; i < 255; i++) {
						var ip = host + "." + i; 
						range(ip); 
						sleep(250);
					}
				})
				break;
			case "7":
				whois(); 
			break;
			
			default: 
			process.exit();
		}
		
	});
			
