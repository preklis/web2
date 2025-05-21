const filter = document.querySelector('.filter-sub');
const main = document.querySelector('main');
const clear = document.querySelector('.clear');
let closes = [];
let arr = [];
const header = document.querySelector('header');

(async () => {
    const res = await fetch("./data.json");
    const data = await res.json();

    data.forEach(item => {
        const container = document.createElement('div');
        container.classList.add('container');
        container.innerHTML = `
            <img src="${item.logo}" alt="logo">
            <div class="head">
                <div class="wrapper">
                    <div class="top">
                        <h2>${item.company}</h2>
                        <div class="stat"></div>
                    </div>
                    <a href="#">${item.position}</a>
                    <ul class="availability">
                        <li>${item.postedAt}</li>
                        <li>${item.contract}</li>
                        <li>${item.location}</li>
                    </ul>
                </div>
                <hr>
                <div class="tags"></div>
            </div>
        `;

        if (item.new) {
            const span = document.createElement('span');
            span.classList.add('new');
            span.textContent = 'New!';
            container.querySelector('.stat').append(span);
        }
        if (item.featured) {
            container.classList.add('featured');
            const span = document.createElement('span');
            span.classList.add('feature');
            span.textContent = 'Featured';
            container.querySelector('.stat').append(span);
        }

        [item.role, item.level, ...item.languages, ...item.tools].forEach(type => {
            const btn = document.createElement('button');
            btn.dataset.type = type;
            btn.textContent = type;
            container.querySelector('.tags').appendChild(btn);
        });

        main.appendChild(container);
    });

    main.querySelectorAll('.tags button').forEach(button => {
        button.onclick = () => {
            filterType(button.dataset.type);
            updateContainer();
        };
    });
})();

clear.onclick = () => {
    arr = [];
    filter.innerHTML = '';
    main.querySelectorAll('.container').forEach(c => c.classList.remove('remove'));
    filter.closest('.filter').style.display = 'none';
};

function addFilter() {
    filter.innerHTML = '';
    arr.forEach(type => {
        const el = document.createElement('div');
        el.classList.add('span');
        el.innerHTML = `<p>${type}</p>
            <button aria-label="remove button"><img src="images/icon-remove.svg" alt=""></button>`;
        filter.appendChild(el);
        filter.closest('.filter').style.display = 'flex';
        closes = [];
        closes.push(el.querySelector('button'));
        closes.forEach(close => {
            close.onclick = () => {
                filter.removeChild(close.closest('.span'));
                arr.splice(arr.indexOf(close.previousElementSibling.textContent), 1);
                updateContainer();
                filter.closest('.filter').style.display = filter.innerHTML ? 'flex' : 'none';
            };
        });
    });
}

function filterType(type) {
    if (!arr.includes(type)) {
        arr.push(type);
        addFilter();
    }
}

function updateContainer() {
    main.querySelectorAll('.container').forEach(container => {
        const types = Array.from(container.querySelectorAll('button')).map(btn => btn.dataset.type);
        const visible = arr.every(type => types.includes(type));
        container.classList.toggle('remove', !visible);
    });
}

function changeBg() {
    header.style["background-image"] = document.body.clientWidth < 700
        ? "url(images/bg-header-mobile.svg)"
        : "url(images/bg-header-desktop.svg)";
}

changeBg();
window.onresize = changeBg;