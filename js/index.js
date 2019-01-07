
mermaidAPI.initialize({startOnLoad: true,
            flowchart:{
                    useMaxWidth:true,
                    htmlLabels:true
            }});
var editor = ace.edit("input");
editor.setTheme("ace/theme/cobalt");
editor.setOptions({
  //fontFamily: "tahoma",
  fontSize: "12pt"
});

//Get mmd
//http://www.example.com/t.html?mmd=graph LR;A --- B;B-->C[fa:fa-ban forbidden];B-->D(fa:fa-spinner);
var site = window.location.href.split('?')[0];
var url = new URL(window.location.href);
var mmd = url.searchParams.get("mmd");
editor.setValue(mmd.replace(/;/g, "\n"));
console.log(mmd);

//Render first time
renderMMD();

//Render after editing
editor.on("change", function(e) {
  renderMMD();
})


//Functions
function renderMMD() {

	console.log("Rendering mmd");
	var dia = editor.getValue();

	console.log(dia);
	var output = document.getElementById("output");
	output.innerHTML = "";

	mermaidAPI.render('theGraph', dia, function(svgCode) {
		output.innerHTML = svgCode;
		console.log(svgCode);

	//Need to edit the SVG for zooming it
	var svg = document.getElementById( 'theGraph' );
	svg.setAttributeNS(null,"style","width:100%;");
	console.log(svg);

	zoomSVG();
	});
}

function svgToDataUri(svgElement){

	console.log("Converting svg to data URI");

	// get svg data and make it base64
	var svgData = new XMLSerializer().serializeToString(svgElement);
	var svgData64 = "data:image/svg+xml;base64," + btoa(svgData)
	return svgData64;

	//console.log("Converting DataURI to ObjectURL");

	// Use blob instead of dataURL
	//var blob = dataURLtoBlob(svgData64);
	//let urlObject;
	//urlObject = URL.createObjectURL(blob);
    	//image.src = urlObject;

};


//Downloads
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', text);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


//Download editable URL
//window.location.href = site+"?mmd="+dia.replace(/\n/g, ";");

//Download as MMD file
document.getElementById("dwn-btn-dia").addEventListener("click", function(){
    // Generate download of hello.txt file with some content
	var dia = editor.getValue();
	var text = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dia)
	var filename = "mermaid.mmd";
    
    download(filename, text);
}, false);

//Download as SVG
document.getElementById("dwn-btn-svg").addEventListener("click", function(){
    // Generate download of hello.txt file with some content
    var text = svgToDataUri(document.getElementById("theGraph"));
    var filename = "mermaid.svg";
    
    download(filename, text);
}, false);




//dataURL to blob
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

//blob to dataURL
function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {callback(e.target.result);}
    a.readAsDataURL(blob);
}

function zoomSVG() {
        var panZoom = window.panZoom = svgPanZoom('#theGraph', {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: 1,
          center: 1
        });
      };



