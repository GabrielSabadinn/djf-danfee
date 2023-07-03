const Danfe = require('../src');
const NFe = require('djf-nfe');
const fs = require('fs');
const puppeteer = require('puppeteer');

function fixture() {
  return 'apiaquipara puxar a nota danfe';
}

module.exports.from = async function (test) {
  var danfe = null;
  var html = null;
  var expectedNumero = '<div>Nº 100</div>';

  // fromXML
  danfe = Danfe.fromXML(fixture());
  // test.ok(danfe.toHtml());
  // console.log('vindoo');

  // fromNFe
  danfe = Danfe.fromNFe(NFe(fixture()));

  html = danfe.toHtml();

  console.log(html);
  // test.ok(html);
  // test.ok(html.indexOf(expectedNumero) !== -1);
  // Salvando em HTML
  fs.writeFileSync('tmp/danfe.html', html, function (err) {
    if (err) throw err;
    console.log('HTML salvo em: tmp/danfe.html');
  });

  // Salvando em PDF com Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: 'tmp/danfe.pdf', format: 'A4' });
  await browser.close();
  console.log('PDF salvo em: tmp/danfe.pdf');

  // fromFile
  try {
    fs.mkdirSync('tmp/');
  } catch (err) {}

  var pathTemp = fs.mkdtempSync('tmp/d') + '/file.xml';
  fs.writeFileSync(pathTemp, fixture());
  danfe = Danfe.fromFile(pathTemp);
  html = danfe.toHtml();
  // test.ok(html);
  // test.ok(html.indexOf(expectedNumero) !== -1);

  fs.writeFileSync(pathTemp + '.html', html, function (err) {
    if (err) throw err;
    console.log('HTML salvo em: ' + pathTemp + '.html');
  });

  // Salvando em PDF com Puppeteer
  const browser2 = await puppeteer.launch();
  const page2 = await browser2.newPage();
  await page2.setContent(html, { waitUntil: 'networkidle0' });
  await page2.pdf({ path: 'tmp/danfe2.pdf', format: 'A4' });
  await browser2.close();
  console.log('PDF salvo em: tmp/danfe2.pdf');

  // test.done();
};

module.exports.invalidFrom = function (test) {
  var invalidValues = ['', null, [], {}, 1];

  for (var value of invalidValues) {
    test.ifError(Danfe.fromXML(value).toHtml());

    test.ifError(Danfe.fromNFe(value).toHtml());

    test.ifError(Danfe.fromFile(value).toHtml());
  }

  // test.done();
};
