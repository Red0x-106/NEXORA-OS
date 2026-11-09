// Clock

function updateTime() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString([], {
            day: "2-digit",
            month: "short"
        });
}

updateTime();

setInterval(updateTime, 1000);


// Windows

const apps =
    document.querySelectorAll(".app");

const windows =
    document.querySelectorAll(".window");

const dockApps =
    document.getElementById("dockApps");

let zIndex = 100;

let dragging = null;


// Open window

function openWindow(windowBox) {

    if (windowBox.style.display !== "block") {

        windowBox.style.display = "block";

        centerWindow(windowBox);

    }

    bringToFront(windowBox);

    addDockButton(windowBox);
}


// Center window

function centerWindow(windowBox) {

    const width =
        windowBox.offsetWidth;

    const height =
        windowBox.offsetHeight;

    const left =
        (window.innerWidth - width) / 2;

    const top =
        58 +
        (window.innerHeight - 58 - 75 - height) / 2;

    windowBox.style.left =
        Math.max(10, left) + "px";

    windowBox.style.top =
        Math.max(70, top) + "px";
}


// Bring window forward

function bringToFront(windowBox) {

    zIndex++;

    windowBox.style.zIndex =
        zIndex;
}


// Desktop apps

apps.forEach(function(app) {

    app.addEventListener(
        "click",
        function() {

            const windowBox =
                document.getElementById(
                    app.dataset.window
                );

            openWindow(windowBox);

        }
    );

});


// Window click

windows.forEach(function(windowBox) {

    windowBox.addEventListener(
        "mousedown",
        function() {

            bringToFront(windowBox);

        }
    );

});


// Close buttons

document.querySelectorAll(".close")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                const windowBox =
                    button.closest(".window");

                windowBox.style.display =
                    "none";

                removeDockButton(
                    windowBox.id
                );

            }
        );

    });


// Minimize buttons

document.querySelectorAll(".minimize")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                const windowBox =
                    button.closest(".window");

                windowBox.style.display =
                    "none";

            }
        );

    });


// Maximize buttons

document.querySelectorAll(".maximize")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                const windowBox =
                    button.closest(".window");


                if (
                    windowBox.classList.contains(
                        "maximized"
                    )
                ) {

                    windowBox.classList.remove(
                        "maximized"
                    );

                    windowBox.style.left =
                        windowBox.dataset.oldLeft;

                    windowBox.style.top =
                        windowBox.dataset.oldTop;

                    windowBox.style.width =
                        windowBox.dataset.oldWidth;

                    windowBox.style.height =
                        windowBox.dataset.oldHeight;

                } else {

                    windowBox.dataset.oldLeft =
                        windowBox.style.left;

                    windowBox.dataset.oldTop =
                        windowBox.style.top;

                    windowBox.dataset.oldWidth =
                        windowBox.offsetWidth + "px";

                    windowBox.dataset.oldHeight =
                        windowBox.offsetHeight + "px";


                    windowBox.classList.add(
                        "maximized"
                    );

                    windowBox.style.left =
                        "0px";

                    windowBox.style.top =
                        "58px";

                    windowBox.style.width =
                        "100vw";

                    windowBox.style.height =
                        "calc(100vh - 116px)";

                }

                bringToFront(windowBox);

            }
        );

    });


// Drag windows

windows.forEach(function(windowBox) {

    const bar =
        windowBox.querySelector(
            ".window-bar"
        );

    bar.addEventListener(
        "mousedown",
        function(event) {

            if (
                event.target.closest("button")
            ) {
                return;
            }

            if (
                windowBox.classList.contains(
                    "maximized"
                )
            ) {
                return;
            }


            dragging = windowBox;

            dragging.startX =
                event.clientX;

            dragging.startY =
                event.clientY;

            dragging.startLeft =
                windowBox.offsetLeft;

            dragging.startTop =
                windowBox.offsetTop;

            bringToFront(windowBox);

        }
    );

});


document.addEventListener(
    "mousemove",
    function(event) {

        if (!dragging) {
            return;
        }


        let newLeft =
            dragging.startLeft +
            event.clientX -
            dragging.startX;

        let newTop =
            dragging.startTop +
            event.clientY -
            dragging.startY;


        const maxLeft =
            window.innerWidth -
            dragging.offsetWidth;

        const maxTop =
            window.innerHeight -
            dragging.offsetHeight -
            14;


        newLeft =
            Math.max(
                0,
                Math.min(
                    newLeft,
                    maxLeft
                )
            );

        newTop =
            Math.max(
                58,
                Math.min(
                    newTop,
                    maxTop
                )
            );


        dragging.style.left =
            newLeft + "px";

        dragging.style.top =
            newTop + "px";

    }
);


document.addEventListener(
    "mouseup",
    function() {

        dragging = null;

    }
);


// Calculator

const display =
    document.getElementById(
        "calculatorDisplay"
    );


document.querySelectorAll(
    ".calculator button[data-value]"
).forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            display.value +=
                button.dataset.value;

        }
    );

});


document.getElementById("clear")
    .addEventListener(
        "click",
        function() {

            display.value = "";

        }
    );


document.getElementById("equals")
    .addEventListener(
        "click",
        function() {

            try {

                display.value =
                    eval(display.value);

            } catch {

                display.value =
                    "Error";

            }

        }
    );


// Notes

const notes =
    document.getElementById(
        "notesText"
    );


const savedNotes =
    localStorage.getItem(
        "nexoraNotes"
    );


if (savedNotes) {

    notes.value =
        savedNotes;

}


notes.addEventListener(
    "input",
    function() {

        localStorage.setItem(
            "nexoraNotes",
            notes.value
        );

    }
);


// Browser

const browserSearch =
    document.getElementById(
        "browserSearch"
    );

const browserFrame =
    document.getElementById(
        "browserFrame"
    );

const browserMessage =
    document.getElementById(
        "browserMessage"
    );


let browserHistory = [];

let browserPosition = -1;


// Load website

function loadWebsite(url) {

    browserSearch.value =
        url;

    browserMessage.style.display =
        "none";

    browserFrame.style.display =
        "block";

    browserFrame.src =
        url;
}


// Open website

function openWebsite() {

    let text =
        browserSearch.value.trim();


    if (text === "") {
        return;
    }


    let url;


    if (
        text.startsWith("http://") ||
        text.startsWith("https://")
    ) {

        url = text;

    } else if (
        text.includes(".")
    ) {

        url =
            "https://" +
            text;

    } else {

        url =
            "https://www.google.com/search?q=" +
            encodeURIComponent(text);

    }


    if (
        browserPosition <
        browserHistory.length - 1
    ) {

        browserHistory =
            browserHistory.slice(
                0,
                browserPosition + 1
            );

    }


    browserHistory.push(url);

    browserPosition =
        browserHistory.length - 1;


    loadWebsite(url);

}


// Go

document.getElementById(
    "browserGo"
).addEventListener(
    "click",
    openWebsite
);


// Enter

browserSearch.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            openWebsite();

        }

    }
);


// Back

document.getElementById(
    "browserBack"
).addEventListener(
    "click",
    function() {

        if (browserPosition > 0) {

            browserPosition--;

            loadWebsite(
                browserHistory[
                    browserPosition
                ]
            );

        }

    }
);


// Forward

document.getElementById(
    "browserForward"
).addEventListener(
    "click",
    function() {

        if (
            browserPosition <
            browserHistory.length - 1
        ) {

            browserPosition++;

            loadWebsite(
                browserHistory[
                    browserPosition
                ]
            );

        }

    }
);


// Refresh

document.getElementById(
    "browserRefresh"
).addEventListener(
    "click",
    function() {

        if (
            browserFrame.src !==
            "about:blank"
        ) {

            browserFrame.src =
                browserFrame.src;

        }

    }
);


// Quick browser links

document.querySelectorAll(
    ".browser-links button"
).forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            browserSearch.value =
                button.dataset.site;

            openWebsite();

        }
    );

});


// Browser fallback

function showBrowserError() {

    browserFrame.style.display =
        "none";

    browserMessage.style.display =
        "block";

    browserMessage.innerHTML = `

        <div class="browser-logo">
            N
        </div>

        <h2>
            This page cannot be displayed here
        </h2>

        <p>
            This website does not allow itself
            to be shown inside NEXORA Browser.
        </p>

        <button
            class="browser-error"
            id="openOutside"
        >
            Open in browser
        </button>

    `;


    document.getElementById(
        "openOutside"
    ).addEventListener(
        "click",
        function() {

            window.open(
                browserSearch.value,
                "_blank"
            );

        }
    );

}


// Themes

const desktop =
    document.querySelector(
        ".desktop"
    );


const savedTheme =
    localStorage.getItem(
        "nexoraTheme"
    );


if (savedTheme) {

    desktop.style.backgroundImage =
        'url("images/' +
        savedTheme +
        '")';

}


document.querySelectorAll(
    ".theme"
).forEach(function(theme) {

    theme.addEventListener(
        "click",
        function() {

            const image =
                theme.dataset.theme;


            desktop.style.backgroundImage =
                'url("images/' +
                image +
                '")';


            localStorage.setItem(
                "nexoraTheme",
                image
            );

        }
    );

});


// Dock

function addDockButton(windowBox) {

    const existing =
        document.querySelector(
            '[data-dock="' +
            windowBox.id +
            '"]'
        );


    if (existing) {
        return;
    }


    const app =
        document.querySelector(
            '[data-window="' +
            windowBox.id +
            '"]'
        );


    if (!app) {
        return;
    }


    const button =
        document.createElement(
            "div"
        );


    button.className =
        "dock-app";


    button.dataset.dock =
        windowBox.id;


    button.innerHTML =
        '<img src="' +
        app.querySelector("img").src +
        '">';


    button.addEventListener(
        "click",
        function() {

            if (
                windowBox.style.display ===
                "none"
            ) {

                windowBox.style.display =
                    "block";

            }


            bringToFront(windowBox);

        }
    );


    dockApps.appendChild(
        button
    );

}


function removeDockButton(id) {

    const button =
        document.querySelector(
            '[data-dock="' +
            id +
            '"]'
        );


    if (button) {

        button.remove();

    }

}