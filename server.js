const {default: axios} = require('axios');
const express = require('express');

const PORT = process.env.PROXY_PORT || 8000;

const app = express();

app.use(express.json());

app.use((req, res) => {
  axios({method: req.method, url: req.url, headers: req.headers})
    .catch(err => {
      if (err.response) {
        return err.response;
      }
      return {status: 500, data: ''};
    })
    .then(response => {
      console.log(req.method, req.url, response.status);
      Object.entries(response.headers).forEach(header =>
        res.setHeader(header[0], header[1])
      );
      res.status(response.status).send(response.data);
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
