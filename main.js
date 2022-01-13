// visor pdf

let myState = {
  pdf: null,
  currentPage: 1,
  zoom: 1,
};

pdfjsLib
  .getDocument(
    "https://prospecciondev.s3.us-east-2.amazonaws.com/123/BTJ11642006131385R832.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4RPRF4JQYN3ZYQUA%2F20220113%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20220113T150457Z&X-Amz-Expires=2400&X-Amz-SignedHeaders=host&X-Amz-Signature=371a7741a6502eee6b5f974c85c9366826dea2f0f9e6d4e4e2481f7fb624fa58"
  )
  .then((pdf) => {
    // more code here
    myState.pdf = pdf;
    render();
  });

function render() {
  myState.pdf.getPage(myState.currentPage).then((page) => {
    // more code here
    let canvas = document.getElementById("pdf_renderer");
    let ctx = canvas.getContext("2d");

    let viewport = page.getViewport(myState.zoom);
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    page.render({
      canvasContext: ctx,
      viewport: viewport,
    });
  });
}

document.getElementById("go_previous").addEventListener("click", (e) => {
  if (myState.pdf == null || myState.currentPage == 1) return;
  myState.currentPage -= 1;
  document.getElementById("current_page").value = myState.currentPage;
  render();
});

document.getElementById("go_next").addEventListener("click", (e) => {
  if (
    myState.pdf == null ||
    myState.currentPage > myState.pdf._pdfInfo.numPages
  )
    return;

  myState.currentPage += 1;
  document.getElementById("current_page").value = myState.currentPage;
  render();
});

document.getElementById("current_page").addEventListener("keypress", (e) => {
  if (myState.pdf == null) return;

  // Get key code
  var code = e.keyCode ? e.keyCode : e.which;

  // If key code matches that of the Enter key
  if (code == 13) {
    var desiredPage = document.getElementById("current_page").valueAsNumber;

    if (desiredPage >= 1 && desiredPage <= myState.pdf._pdfInfo.numPages) {
      myState.currentPage = desiredPage;
      document.getElementById("current_page").value = desiredPage;
      render();
    }
  }
});

document.getElementById("zoom_in").addEventListener("click", (e) => {
  if (myState.pdf == null) return;
  myState.zoom += 0.5;
  render();
});

document.getElementById("zoom_out").addEventListener("click", (e) => {
  if (myState.pdf == null) return;
  myState.zoom -= 0.5;
  render();
});

// ================================================================
