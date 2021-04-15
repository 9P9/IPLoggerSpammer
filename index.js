const request = require('request');
const prompt = require('prompt');
const colors = require('colors');
const chalk = require('chalk');
const nodeUrlExpand = require('node-url-expand');
var proxyChecker = require('proxy-checker');
const fs = require('fs');
var ping = require('jjg-ping');
var sleep = require('system-sleep');
var proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');
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
process.on('uncaughtException', e => {});
process.on('uncaughtRejection', e => {});
process.warn = () => {};
console.warn = function() {};


const devices = [{
    useragent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.235 Chrome/73.0.3683.104 Electron/5.0.0-beta.8 Safari/537.36',
    xsuper: '{"os":"Windows","browser":"Discord Client","release_channel":"canary","client_version":"0.0.235","os_version":"10.0.17134","os_arch":"x64","client_build_number":36442,"client_event_source":null}',
	referrer: "https://discordapp.com/",
   xtrack: "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc0LjAuMzcyOS4xNTcgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc0LjAuMzcyOS4xNTciLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
}, {
    useragent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.235 Chrome/73.0.3683.104 Electron/5.0.0-beta.8 Safari/537.36',
    xsuper: '{"os":"Windows","browser":"Discord Client","release_channel":"canary","client_version":"0.0.235","os_version":"10.0.17134","os_arch":"x64","client_build_number":36442,"client_event_source":null}',
	referrer: "https://pornhub.com",
	xtrack: "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc0LjAuMzcyOS4xNTcgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc0LjAuMzcyOS4xNTciLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
}, {
    useragent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.220 Chrome/71.0.3683.104 Electron/4.0.3-beta.8 Safari/537.36',
    xsuper: '{"os":"Windows","browser":"Discord Client","release_channel":"canary","client_version":"0.0.220","os_version":"10.0.1903","os_arch":"x64","client_build_number":36442,"client_event_source":null}',
	referrer: "https://moshimonsters.co.uk",  
	xtrack: "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc0LjAuMzcyOS4xNTcgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc0LjAuMzcyOS4xNTciLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
}, {
    useragent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.305 Chrome/69.0.3497.128 Electron/4.0.8 Safari/537.36",
    xsuper: '{"os":"Windows","browser":"Discord Client","release_channel":"stable","client_version":"0.0.305","os_version":"10.0.17134","os_arch":"x64","client_build_number":36215,"client_event_source":null}',
	referrer: "https://clubpenguin.com",   
	xtrack: "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc0LjAuMzcyOS4xNTcgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc0LjAuMzcyOS4xNTciLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
}, {
    useragent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.340 Chrome/72.0.3197.128 Electron/4.0.9 Safari/537.36",   
	xsuper: '{"os":"Windows","browser":"Discord Client","release_channel":"stable","client_version":"0.0.340","os_version":"10.0.18703","os_arch":"x32","client_build_number":37215,"client_event_source":null}',
	referrer: "https://getfucked.com",   
	xtrack: "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc0LjAuMzcyOS4xNTcgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc0LjAuMzcyOS4xNTciLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
}, {
    useragent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.369 Chrome/74.0.303.111 Electron/4.5.3 Safari/537.36",
    xsuper: '{"os":"Windows","browser":"Discord Client","release_channel":"stable","client_version":"0.0.369","os_version":"10.0.18502","os_arch":"x32","client_build_number":35192,"client_event_source":null}',
	referrer: "https://RapedByLuci.com",
	xtrack: "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzc0LjAuMzcyOS4xNTcgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6Ijc0LjAuMzcyOS4xNTciLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwiY2xpZW50X2J1aWxkX251bWJlciI6OTk5OSwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0="
}];


function send(proxy, link) {
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
	let device = devices[Math.floor(Math.random() * devices.length)];
	let referer = referrer[Math.floor(Math.random() * referrer.length)];
    request.get(link, {
        json: true,
        proxy: 'http://' + proxy,
        headers: {
			'user-agent': device.useragent, 
			'referer': referer,
			'x-super-properties': Buffer.from(device.xsuper).toString('base64')		
			
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
               console.log(chalk.red("[Attack] Failed " + link + " not flooded | Error Code: " + res.statusCode));
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
				setTimeout(() => scrapeProxies(), 10 * 100 * 1000);
				fs.writeFile('proxies.txt', proxies, function (err) {
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
				prompt.get(['link'], function(err, result) {
				console.log('');
				console.log(chalk.red('Ip Logger Link '));
				
				const link = result.link;
				console.log("");
				proxies.forEach(proxy => send(proxy, link));
				});
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
		
		
		
