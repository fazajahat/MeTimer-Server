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
