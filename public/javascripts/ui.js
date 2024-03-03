// Define namespace for app code
var myApp = myApp || {};

// Define ui module
myApp.ui = (function() {

    // Private variables and functions
    let overlay = document.querySelector('#overlay');
    let burgerIcon = document.querySelector('#burger');

    let textarea = document.querySelector('textarea');
    let features = document.querySelector('.features');
    let chatForm = document.querySelector('.chat__form');
    let chatSubmitButton = document.querySelector('#chat__submit__icon');

    let apiModal = document.querySelector('#api__modal');
    let apiModalForm = document.querySelector('.api__modal__form');
    let apiModalInput = document.querySelector('.api__modal__input');
    let apiModalButton = document.querySelector('a[name=api-modal-button]');
    let apiModalCrossIcon = document.querySelector('#api__modal__cross__icon');

    // Function that either shows or hides side nav based on the
    // current state of the side nav as well as the event type.
    const toggleSideNav = (e) => {
        let sidenav = document.querySelector('.sidenav');
        let isActive = sidenav.getBoundingClientRect().x >= 0;

        if (e.type === 'click') {
            if (isActive) {
                sidenav.style.left = '-100%';
                overlay.style.zIndex = -5;
                overlay.style.opacity = 0;
            } else {
                sidenav.style.left = 0;
                overlay.style.zIndex = 0;
                overlay.style.opacity = 0.7;
            };
        };

        if (e.type === 'resize') {
            (window.innerWidth > 768) ? sidenav.style.left = 0 : sidenav.style.left = '-100%';
            overlay.style.zIndex = -5;
            overlay.style.opacity = 0;
        };
    };

    // Adjusts main message textarea height based on input
    const adjustInputHeight = (e) => {
        textarea.style.height = '0px';
        if (textarea.scrollHeight > textarea.clientHeight)
            textarea.style.height = textarea.scrollHeight + 'px';
    };

    // Shows api modal
    const showApiModal = (e) => {
        apiModal.showModal();
        apiModal.style.opacity = 1;
    };

    // Hides api modal
    const closeApiModal = (e) => {
        apiModal.style.opacity = 0;
        setTimeout(() => apiModal.close(), 200);
    };

    // Submits api modal form
    const submitApiForm = (e) => {
        e.preventDefault();
        let userInput = apiModalInput.value;
        let result = myApp.app.validateApiKey(userInput);
        if (result) {
            localStorage.setItem('myApiKey', apiModalInput.value);
            window.location.reload();
        } else {
            alert("Invalid API key!");
        };
    };

    // Binds event listeners to the UI
    const bindEvents = () => {
        // Events for side nav functionality
        window.addEventListener('resize', toggleSideNav);
        overlay.addEventListener('click', toggleSideNav);
        burgerIcon.addEventListener('click', toggleSideNav);

        // Events for autofill examples in new chat page
        if (features && features.children.length > 0 && !textarea.getAttribute('disabled')) {
            for (let i = 0; i < features.children.length; i++) {
                features.children[i].addEventListener('click', (e) => {
                    textarea.value = e.target.innerText.split("\"")[1];
                    adjustInputHeight(e);
                    textarea.focus();
                });  
            };
        };

        // Events for api key modal
        apiModalButton.addEventListener('click', showApiModal);
        apiModalForm.addEventListener('submit', submitApiForm);
        apiModalCrossIcon.addEventListener('click', closeApiModal);

        // Events for main message textarea
        textarea.addEventListener('input', adjustInputHeight);
        chatForm.addEventListener('submit', myApp.chat.submitChatForm);
        chatSubmitButton.addEventListener('click', myApp.chat.submitChatForm);
        textarea.addEventListener('keypress', (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                myApp.chat.submitChatForm(e);
            };
        });
    };

    return {
        bindEvents,
        toggleSideNav
    };
})();