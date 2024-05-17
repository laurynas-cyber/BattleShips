const DropZone = document.querySelectorAll(".drop-zone");

const testZone = document.querySelector("#testzone");

DropZone.forEach((zone) => {
  zone.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  zone.addEventListener("drop", function (event) {
    // zone.prepend(card);
    zone.appendChild(card);
  });
});

DropZone.forEach((zone) =>
  zone.addEventListener("click", function () {
    let html = ` <div class="zone nothit">
  <div class="animationNot-container">
    <div class="animationNot"></div>
    <div class="animationNot-delay"></div>
    <div class="animationNot-delay2"></div>
  </div>
</div>`;
    console.log(zone);
    zone.innerHTML = html;
  })
);
