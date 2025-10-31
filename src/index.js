/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(req) {
		const url = new URL(req.url)
		url.pathname = "/__scheduled";
		url.searchParams.append("cron", "* * * * *");
		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
	},

	async scheduled(event, env, ctx) {
    try {
		const response = await fetch('https://pubsubhubbub.appspot.com/subscribe', {
    	method: 'POST',
    	headers: {
      	'Content-Type': 'application/x-www-form-urlencoded',
    	},
    	body: new URLSearchParams({
      	'hub.mode': 'subscribe',
      	'hub.topic': 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCw3BCSojo1NKBw0xvfKa4ZQ',
      	'hub.callback': 'https://youtube-live-checker.stmarinadfw.workers.dev/api/webhook',
      	'hub.lease_seconds': '864000',
    	}),
  	  });

      if (!response.ok) {
        console.error(`Failed to post to URL: ${response.status} ${response.statusText}`);
      } else {
        console.log("Successfully posted to URL.");
      }
    } catch (error) {
      console.error("Error during scheduled POST request:", error);
    }
}};
