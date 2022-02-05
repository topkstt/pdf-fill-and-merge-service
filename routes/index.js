var express = require('express');
var router = express.Router();
var fill_pdf = require('@topkstt/fill-pdf-thai');
var fs = require('fs');
var AWS = require('aws-sdk');
const request = require('request');
const PDFMerger = require('pdf-merger-js');
const flattener = require('pdf-flatten');

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const { body, validationResult } = require('express-validator');

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

router.post('/fill', function(req, res, next) {
  var random_string = makeid(20);
  var templete_file = "./pdf_template/"+req.body.template_name+'.pdf';
  var output_file = "./tmp/"+random_string+'.pdf';
  fill_pdf.generatePdf({fields:req.body.fill_data},templete_file,req.body.font_name,{fontSize: req.body.font_size},output_file,async function (error, stdout, stderr) {
    if (error) {
      res.status(400)
      return res.json(error)
    }
    const fileContent = fs.readFileSync(output_file);
    const params = {
      Bucket: BUCKET_NAME,
      Key: 'generated_pdf/'+random_string+'.pdf',
      Body: fileContent,
      ACL: 'public-read',
      ContentType : 'application/pdf'
    };
    await s3.upload(params, function (err, data) {
      if (err) {
        res.status(400)
        return res.json(err)
      }
      return res.json({
        'message': 'Successful',
        'location': 'generated_pdf/'+random_string+'.pdf',
        'url': data.Location
      });
    });
  })
});

router.post('/merge', async function (req, res, next) {
  var random_string = makeid(20);
  var output_file = "./tmp/"+random_string+'.pdf';
  var merger = new PDFMerger();
  var lists = req.body.lists;

  for (let i = 0; i < lists.length; i++) {
    var url = lists[i];
    await getFileBuffer(url).then(async function (response) {
      merger.add(response);
      if (i + 1 === lists.length) {
        await merger.save(output_file);
        const fileContent = fs.readFileSync(output_file);
        const params = {
          Bucket: BUCKET_NAME,
          Key: 'generated_pdf/' + random_string + '.pdf',
          Body: fileContent,
          ACL: 'public-read',
          ContentType: 'application/pdf'
        };

        await s3.upload(params, function (err, data) {
          if (err) {
            res.status(400)
            return res.json(err)
          }
          return res.json({
            'message': 'Successful',
            'location': 'generated_pdf/' + random_string + '.pdf',
            'url': data.Location
          });
        });
      }
    });
  }
});

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
  }
  return result;
}

function getFileBuffer(url){
  return new Promise((resolve) => {
    request({url, encoding: null},(err, resp, buffer) => {
      flattener.flatten(buffer).then(res => {
        resolve(res)
      })
    });
  });
}

module.exports = router;
