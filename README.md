This is a copy of reddits r/place.

It has a 75 by 125 grid for placing blocks and uses PostgreSQL to store locations and reload them. 
It is a active server meaning that new block will upload in read time with no need for refreshing. 

It is meant to be hosted on heroku 

orignal concept: https://www.youtube.com/watch?v=y_J1SPXilGg

To use locally use "node index" in termina; on directory to activate localhost: 3000

To change size for canvas change it in html, then change the constants in index.js and the button bounds to dimesions in html divided by square size in place.js. Also need to make sure the canvas corrdinate is divided by square size in the coordinate from click function

Project Ideas:
Make it bigger and add zoom. Add a graphing based off of math equations thing? 
Add grid. Make sure the app dosent keep going to sleep. Find a way to block tamper monkey and other hacks
