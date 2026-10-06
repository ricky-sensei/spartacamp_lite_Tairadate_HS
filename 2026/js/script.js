var header = document.getElementById("pagetop")
var headerBasePath = document.body.dataset.headerBasePath || "../"

// ページごとの参考サイトは、ヘッダーを書き込む前に読み取っておく
// （#pagetop の中に書かれていても、ヘッダーで上書きされて消えないようにする）。
const pageReferences = Array.from(document.querySelectorAll("#page-references a")).map((link) => ({
    title: link.textContent.trim(),
    url: link.href,
}));

if (header) header.innerHTML = `
      <header id="header">
      <a href="${headerBasePath}index.html"><img class="header_img" src="${headerBasePath}img/header_img_spartacamp_lite.png" alt=""></a>
      <ul>
            <li><a href="${headerBasePath}index.html"><img srcset="${headerBasePath}img/header_home_responsive.svg 768w, ${headerBasePath}img/header_home.svg 1200w" src="${headerBasePath}img/header_home.svg" alt="home"></a></li>
            <li><a href="#pagetop"><img srcset="${headerBasePath}img/header_pagetop_responsive.svg 768w, ${headerBasePath}img/header_pagetop.svg 1200w" src="${headerBasePath}img/header_pagetop.svg" alt=""></a></li>
            <li class="ref-menu-item">
                  <button class="ref-menu-button" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="ref-menu-panel" aria-label="ドキュメント・参考サイトを開く"><img srcset="${headerBasePath}img/header_document_responsive.svg 768w, ${headerBasePath}img/header_document.svg 1200w" src="${headerBasePath}img/header_document.svg" alt=""></button>
                  <div class="ref-menu-panel" id="ref-menu-panel" hidden></div>
            </li>
      </ul>
      </header>
`

// documentボタンのプルダウン。全ページ共通のドキュメントと、
// ページごとの参考サイト（本文内の #page-references にあるリンク）を表示する。
const commonReferences = [
    { title: "Python 公式ドキュメント", url: "https://docs.python.org/ja/3/" },
    { title: "pyxel公式github", url: "https://github.com/kitao/pyxel/blob/main/README.md" },
];

(function () {
    const button = document.querySelector(".ref-menu-button");
    const panel = document.getElementById("ref-menu-panel");
    if (!button || !panel) return;

    const addGroup = (label, links) => {
        if (!links.length) return;
        const group = document.createElement("div");
        group.className = "ref-menu-group";
        const heading = document.createElement("p");
        heading.className = "ref-menu-label";
        heading.textContent = label;
        const list = document.createElement("ul");
        links.forEach(({ title, url }) => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener";
            link.textContent = title;
            item.appendChild(link);
            list.appendChild(item);
        });
        group.append(heading, list);
        panel.appendChild(group);
    };

    addGroup("ドキュメント", commonReferences);
    addGroup("このページの参考サイト", pageReferences);

    const open = () => {
        panel.hidden = false;
        button.setAttribute("aria-expanded", "true");
    };
    const close = () => {
        panel.hidden = true;
        button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", (event) => {
        event.stopPropagation();
        if (panel.hidden) open();
        else close();
    });
    document.addEventListener("click", (event) => {
        if (!panel.hidden && !panel.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) {
            close();
            button.focus();
        }
    });
})();
function copyCode(buttonElement) {
    // ボタンの親要素である <pre> タグを取得
    const preElement = buttonElement.closest('pre');
    
    if (!preElement) {
        alert('エラー: 親のコードブロックが見つかりません。');
        return;
    }

    // preElement のクラスに 'uneditable' が含まれているかチェック
    if (preElement && preElement.classList.contains('uneditable')) {
        const uneditableMessage = "コピペできると思った？？ざんねーーーーーんｗｗｗ";
        const clipboardText = "まさままさか、実はコピペできるかも？とか思っちゃった？？\nざんねーーーーんｗｗｗ\nえ、前のコピペが消えた？？しらないなぁーーｗｗｗ\nWin + Vでもしてみたら？？ｗｗｗｗｗ"
        navigator.clipboard.writeText(clipboardText).then(() => {
            alert(uneditableMessage); // クリップボードにコピー後、同じメッセージをアラート
        }).catch(err => {
            alert('クリップボードへのコピーに失敗しました: ' + err);
        });
        return; // ここで処理を終了し、通常のコードコピーは行わない
    }

    // <pre> タグ内の <code> タグのテキストを取得
    const codeElement = preElement.querySelector('code');
    

    if (!codeElement) {
        alert('エラー: コード要素が見つかりません。');
        return;
    }

    const code = codeElement.innerText;

    navigator.clipboard.writeText(code).then(() => {
        alert('コードをコピーしました！');
    }).catch(err => {
        alert('コピーに失敗しました: ' + err);
    });
}

// ページ内検索付きハンバーガーメニュー（C案）
(function () {
    const siteHeader = document.getElementById("header");
    const headerList = siteHeader && siteHeader.querySelector("ul");
    const content = document.querySelector(".markdown-preview");

    if (!headerList || !content) return;

    // 古いページで小見出しに使われているh4を、現在のh2へ統一する。
    // h3はh2の項目内の小見出しとして使うため変換しない。
    // トップページ（index.html）のもくじカード内の見出しは対象外。
    Array.from(content.querySelectorAll("h4")).filter((heading) => !heading.closest(".index_section")).forEach((heading) => {
        const replacement = document.createElement("h2");
        Array.from(heading.attributes).forEach((attribute) => {
            replacement.setAttribute(attribute.name, attribute.value);
        });
        replacement.innerHTML = heading.innerHTML;
        replacement.classList.add("legacy-section-heading");
        heading.replaceWith(replacement);
    });

    // 旧教材では、見出しをliで囲んで章立てを表現している。
    // 本文の箇条書きと区別して、構造用リストだけ表示を整える。
    const legacySectionItems = Array.from(content.querySelectorAll("li")).filter((listItem) => {
        const firstElement = listItem.firstElementChild;
        return firstElement && firstElement.matches("h1, h2");
    });

    legacySectionItems.forEach((listItem) => {
        listItem.classList.add("legacy-section-item");
    });

    Array.from(content.querySelectorAll("ul, ol")).forEach((list) => {
        const directItems = Array.from(list.children).filter((child) => child.tagName === "LI");
        if (directItems.length && directItems.every((item) => item.classList.contains("legacy-section-item"))) {
            list.classList.add("legacy-section-list");
        }
    });

    const headings = Array.from(content.querySelectorAll("h1, h2"));
    const usedIds = new Set(Array.from(content.querySelectorAll("[id]")).map((element) => element.id));
    headings.forEach((heading, index) => {
        if (heading.id) return;

        let id = `section-${index + 1}`;
        let suffix = 2;
        while (usedIds.has(id)) {
            id = `section-${index + 1}-${suffix}`;
            suffix += 1;
        }
        heading.id = id;
        usedIds.add(id);
    });

    if (!headings.length) return;

    const item = document.createElement("li");
    item.className = "page-menu-item";
    item.innerHTML = `
        <button class="page-menu-button" type="button" aria-label="ページ内メニューを開く" aria-expanded="false" aria-controls="page-menu-panel">
            <span></span><span></span><span></span>
        </button>`;
    headerList.appendChild(item);

    document.body.insertAdjacentHTML("beforeend", `
        <button class="page-menu-scrim" type="button" tabindex="-1" aria-label="メニューを閉じる"></button>
        <aside class="page-menu-panel" id="page-menu-panel" aria-hidden="true" aria-label="ページ内メニュー">
            <div class="page-menu-head">
                <div>
                    <p class="page-menu-kicker">On this page</p>
                    <p class="page-menu-title">項目を検索</p>
                </div>
                <button class="page-menu-close" type="button" aria-label="メニューを閉じる">×</button>
            </div>
            <label class="page-menu-search-wrap">
                <span class="visually-hidden">項目を検索</span>
                <input class="page-menu-search" type="search" placeholder="項目名を入力…" autocomplete="off">
            </label>
            <nav class="page-menu-body" aria-label="このページの目次">
                <ol class="page-menu-list"></ol>
                <p class="page-menu-empty">一致する項目がありません</p>
            </nav>
        </aside>`);

    const button = item.querySelector(".page-menu-button");
    const panel = document.getElementById("page-menu-panel");
    const closeButton = panel.querySelector(".page-menu-close");
    const scrim = document.querySelector(".page-menu-scrim");
    const list = panel.querySelector(".page-menu-list");
    const search = panel.querySelector(".page-menu-search");
    const empty = panel.querySelector(".page-menu-empty");

    let currentGroup = null;
    headings.forEach((heading) => {
        const link = document.createElement("a");
        link.className = "page-menu-link";
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();
        link.dataset.targetId = heading.id;

        if (heading.tagName === "H1") {
            currentGroup = document.createElement("li");
            currentGroup.className = "page-menu-group";
            currentGroup.appendChild(link);
            list.appendChild(currentGroup);
        } else {
            if (!currentGroup) {
                currentGroup = document.createElement("li");
                currentGroup.className = "page-menu-group";
                list.appendChild(currentGroup);
            }
            let sublist = currentGroup.querySelector(".page-menu-sublist");
            if (!sublist) {
                sublist = document.createElement("ol");
                sublist.className = "page-menu-sublist";
                currentGroup.appendChild(sublist);
            }
            const subitem = document.createElement("li");
            subitem.appendChild(link);
            sublist.appendChild(subitem);
        }
    });

    const openMenu = () => {
        document.body.classList.add("menu-open");
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", "ページ内メニューを閉じる");
        panel.setAttribute("aria-hidden", "false");
        window.setTimeout(() => search.focus(), 0);
    };

    const closeMenu = () => {
        document.body.classList.remove("menu-open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "ページ内メニューを開く");
        panel.setAttribute("aria-hidden", "true");
        button.focus();
    };

    button.addEventListener("click", () => {
        if (button.getAttribute("aria-expanded") === "true") closeMenu();
        else openMenu();
    });
    closeButton.addEventListener("click", closeMenu);
    scrim.addEventListener("click", closeMenu);
    list.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && document.body.classList.contains("menu-open")) closeMenu();
    });

    search.addEventListener("input", () => {
        const query = search.value.trim().toLocaleLowerCase("ja");
        let visibleCount = 0;
        list.querySelectorAll(".page-menu-group").forEach((group) => {
            const match = group.textContent.toLocaleLowerCase("ja").includes(query);
            group.hidden = !match;
            if (match) visibleCount += 1;
        });
        empty.classList.toggle("is-visible", visibleCount === 0);
    });

    if ("IntersectionObserver" in window) {
        const links = new Map(Array.from(list.querySelectorAll("a")).map((link) => [link.dataset.targetId, link]));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                links.forEach((link) => link.classList.remove("is-active"));
                const active = links.get(entry.target.id);
                if (active) active.classList.add("is-active");
            });
        }, { rootMargin: "-90px 0px -72% 0px" });
        headings.forEach((heading) => observer.observe(heading));
    }
})();
