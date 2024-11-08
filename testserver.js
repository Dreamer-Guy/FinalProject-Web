import express from 'express';
import session from 'express-session';

const app = express();

// Set up the session middleware
app.use(session({
  secret: 'your-secret-key', // A secret key to sign the session ID cookie
  resave: false,             // Don't force a session to be saved back to the session store
  saveUninitialized: true,   // Save a session that is new but not modified
  cookie: { secure: false }  // Set secure to true in production if using HTTPS
}));



app.post('/here', (req, res) => {
    req.session.user = "user";
    req.session.visited=true;
    console.log(req.session);
    console.log(req.sessionID);
    return res.render('index');
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server sdasdasrunning on http://localhost:${port}`);
});
