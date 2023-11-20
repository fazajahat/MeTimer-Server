module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
	  env: {
            "PORT": 80,
            "NODE_ENV": "development",
		"JWT_SECRET": "SECRET",
		  "OPENAI_APIKEY": "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",
		  "MONGODB_URI": "mongodb+srv://geryjuniarto99:Gwej0tKuMg7cxa7S@cluster0.2wckrxu.mongodb.net/?retryWrites=true&w=majority"
        }
  }]
}
