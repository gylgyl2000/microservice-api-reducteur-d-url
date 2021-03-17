}
});  
};


// POST REQUEST

// define a function as an exported object to have access to it 
exports.postLongUrl = function(req, res) {
// check the maxShortUrl  is updated
shortUrlUpdater();

// to chop the URL into the pieces:
let reqUrl = req.body.url;
let protocol = reqUrl.substring(0, reqUrl.indexOf("://") + 3);
let urlWithSubdir = reqUrl.substring(protocol.length);
let hostName = "";   

if (urlWithSubdir.indexOf("/") >= 0) {
  hostName = urlWithSubdir.substring(0, urlWithSubdir.indexOf("/"));
}
else {
  // if the URL doesn't have subdirectories, then hostname should be set equal to urlWithSubdir
  hostName = urlWithSubdir;
};

// the project requires that POSTed URLs should be in the format: http(s)://www.example.com(/more/routes)
if (protocol != "http://" && protocol != "https://") {
  return res.json( {"error": "invalid URL"} );
};
 
dns.lookup(hostName, function(err, address) {
  if (err) {
    return res.json( {"error": "invalid hostname"} )
  }
  else {
    UrlEntry.findOne( {"original_url": reqUrl}, function(err, data) {
      if (err) return console.log("Error querying the database for reqUrl:", err);

      if (data) {
        return res.json({
          "original_url": reqUrl,
          "short_url": data.short_url
        });
      } else {
        // if there are no matching records, create a new entry and save it to the DB:      
        let newEntry = new UrlEntry({
          "original_url": reqUrl,
          "short_url": maxShortUrl + 1
        });      
        newEntry.save(function(err, data) {
          if (err) return console.log("Error:", err);
          return res.json({
            "original_url": reqUrl,
            "short_url": maxShortUrl + 1
          });
        });

      };     
    })  
  }  
}); 
}; 

// GET REQUEST

// define a function as an exported object to have access to it 

exports.getShortUrl = function(req, res) {  
//  .../api/shorturl/<short_url> 
let shortUrl = req.params.short_url;
// to check that the user has requested a valid short URL (i.e. a number)
// the only way to check for NaN is with isNaN(),because NaN === NaN resolves to false and parseInt("12px") returns 12
if ( isNaN( +shortUrl ) ) {
  // NB: process.env.PWD is the working directory when the process was started, and stays the same for the entire process, unlike __dirname and process.cwd().
  res.status(404).sendFile(process.env.PWD + "/views/404.html" );
}
else {
  // if the shortUrl is a valid number, check if it saved in the DB using .findOne():
  UrlEntry
    .findOne( {"short_url": shortUrl}, function(err, data) {
      if (err) return console.log("Error:", err);      
      if (data) {
        // to redirect the user to the associated long-form URL:
        res.redirect(data.original_url);
      }
      else {
        // the user has tried to navigate to non-existing short_url page on the site
        res.status(404).sendFile(process.env.PWD + "/views/404.html");
      }
  });
  
}   
}; 