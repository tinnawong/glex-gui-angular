function saveTextAsFile(data, filename) {
    if (!data) {
        console.error('Console.save: No data')
        return;
    }

    if (!filename) filename = 'console.json'

    var blob = new Blob([data], { type: 'text/plain' }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')
    // FOR IE:

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else {
        var e = document.createEvent('MouseEvents'),
            a = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
        e.initEvent('click', true, false,);
        a.dispatchEvent(e);
    }
}


function expFile() {
    var fileText = "I am the first part of the info being emailed.\r\nI am the second part.\r\nI am the third part.";
    var fileName = "newfile001.txt"
    saveTextAsFile(fileText, fileName);
}


export const downloadText = (room_id, datas) => {
    let text = '';
    datas.forEach(element => {
      text += element.message;
    });
    downloadContent(room_id, text);
  };
  
  function downloadContent(name, content) {
    const atag = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    atag.href = URL.createObjectURL(file);
    atag.download = name;
    atag.click();
  }