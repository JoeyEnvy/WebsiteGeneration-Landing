function doPost(e){
  const data = JSON.parse(e.postData.contents);
  const to = data.to || 'joe@websitegeneration.co.uk';
  const subject = data.subject || 'New enquiry';
  const p = data.payload || {};
  const body =
    'New enquiry from WebsiteGeneration.co.uk\n\n' +
    'Name: ' + (p.name||'') + '\n' +
    'Email: ' + (p.email||'') + '\n' +
    'Message:\n' + (p.message||'') + '\n';

  MailApp.sendEmail({ to, subject, htmlBody: '<pre>'+body.replace(/</g,'&lt;')+'</pre>' });
  return ContentService.createTextOutput(JSON.stringify({ ok:true }))
    .setMimeType(ContentService.MimeType.JSON);
}
