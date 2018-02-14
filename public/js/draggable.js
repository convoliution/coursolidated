// target elements with the "draggable" class
interact('.draggable').draggable({
    // enable inertial throwing
    inertia: true,
    // enable autoScroll
    autoScroll: {
        container: document.querySelector(".schedule.active"),
        margin: 50,
        distance: 5,
        interval: 10
    },
    // call this function on every dragmove event
    onmove: dragMoveListener
});

function dragMoveListener(event) {
    var target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
          target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

// enable draggables to be dropped into this
interact('.slot').dropzone({
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.25,

    // listen for drop related events:

    ondropactivate: function(event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
    },
    ondragenter: function(event) {
        var draggableElement = event.relatedTarget;
        var dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
    },
    ondragleave: function(event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
    },
    ondrop: function(event) {
        console.log(event.relatedTarget + " dropped on " + event.target);

    },
    ondropdeactivate: function(event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
    }
});
