(function (global) {
    'use strict';

    const BASE = 'https://assets.mcasset.cloud/26.1.2/assets/minecraft/textures/';
    const _cache = {};

    function loadImg(path) {
        if (_cache[path]) return _cache[path];
        const p = new Promise(resolve => {
            const img = new Image();
            img.onload  = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = BASE + path + '.png';
        });
        return (_cache[path] = p);
    }

    // ── Texture definitions ───────────────────────────────────────────
    // flat: render as 2D sprite | top/left/right/all/side: render as 3D cube
    const ITEMS = {
        iron_ingot:  { name: 'Iron Ingot',    flat:  'item/iron_ingot' },
        furnace:     { name: 'Furnace',        top:   'block/furnace_top',   left: 'block/furnace_side',  right: 'block/furnace_front' },
        smooth_stone:{ name: 'Smooth Stone',   all:   'block/smooth_stone' },
        oak_log:     { name: 'Oak Log',        top:   'block/oak_log_top',   side: 'block/oak_log' },
        paper:       { name: 'Paper',          flat:  'item/paper' },
        oak_planks:  { name: 'Oak Planks',     all:   'block/oak_planks' },
        blaze_rod:   { name: 'Blaze Rod',      flat:  'item/blaze_rod' },
        cobblestone: { name: 'Cobblestone',    all:   'block/cobblestone' },
        flint:       { name: 'Flint',          flat:  'item/flint' },
        oak_slab:    { name: 'Oak Slab',       all:   'block/oak_planks', slab: true },
        bookshelf:   { name: 'Bookshelf',      top:   'block/oak_planks',   left: 'block/bookshelf',     right: 'block/bookshelf' },
        stone:       { name: 'Stone',          all:   'block/stone' },
        string:      { name: 'String',         flat:  'item/string' },
        stick:       { name: 'Stick',          flat:  'item/stick' },
        stone_slab:  { name: 'Stone Slab',     all:   'block/stone',       slab: true },
    };

    const BLOCKS = {
        blast_furnace:     { name: 'Blast Furnace',     top: 'block/blast_furnace_top',      left: 'block/blast_furnace_side',      right: 'block/blast_furnace_front' },
        smoker:            { name: 'Smoker',             top: 'block/smoker_top',              left: 'block/smoker_side',             right: 'block/smoker_front' },
        cartography_table: { name: 'Cartography Table', top: 'block/cartography_table_top',   left: 'block/cartography_table_side1', right: 'block/cartography_table_side2' },
        brewing_stand:     { name: 'Brewing Stand',     flat: 'item/brewing_stand' },
        composter:         { name: 'Composter',         top: 'block/composter_top',           left: 'block/composter_side',          right: 'block/composter_side' },
        barrel:            { name: 'Barrel',             top: 'block/barrel_top',              left: 'block/barrel_side',             right: 'block/barrel_side' },
        fletching_table:   { name: 'Fletching Table',   top: 'block/fletching_table_top',     left: 'block/fletching_table_side',    right: 'block/fletching_table_front' },
        cauldron:          { name: 'Cauldron',           top: 'block/cauldron_top',            left: 'block/cauldron_side',           right: 'block/cauldron_side' },
        lectern:           { name: 'Lectern',            custom: 'lectern' },
        stonecutter:       { name: 'Stonecutter',        top: 'block/stonecutter_top',         left: 'block/stonecutter_side',        right: 'block/stonecutter_side' },
        loom:              { name: 'Loom',               top: 'block/loom_top',                left: 'block/loom_side',               right: 'block/loom_front' },
        smithing_table:    { name: 'Smithing Table',     top: 'block/smithing_table_top',      left: 'block/smithing_table_side',     right: 'block/smithing_table_front' },
        grindstone:        { name: 'Grindstone',         top: 'block/grindstone_round',        left: 'block/grindstone_side',         right: 'block/grindstone_pivot' },
    };

    // ── Recipes ───────────────────────────────────────────────────────
    const RECIPES = {
        armorer:      { result: 'blast_furnace',     grid: [['iron_ingot','iron_ingot','iron_ingot'],['iron_ingot','furnace','iron_ingot'],['smooth_stone','smooth_stone','smooth_stone']] },
        butcher:      { result: 'smoker',            grid: [[null,'oak_log',null],['oak_log','furnace','oak_log'],[null,'oak_log',null]] },
        carto:        { result: 'cartography_table', grid: [['paper','paper',null],['oak_planks','oak_planks',null],['oak_planks','oak_planks',null]] },
        cleric:       { result: 'brewing_stand',     grid: [[null,null,null],[null,'blaze_rod',null],['cobblestone','cobblestone','cobblestone']] },
        farmer:       { result: 'composter',         grid: [['oak_slab',null,'oak_slab'],['oak_slab',null,'oak_slab'],['oak_slab','oak_slab','oak_slab']] },
        fisherman:    { result: 'barrel',            grid: [['oak_planks','oak_slab','oak_planks'],['oak_planks',null,'oak_planks'],['oak_planks','oak_slab','oak_planks']] },
        fletcher:     { result: 'fletching_table',   grid: [['flint','flint',null],['oak_planks','oak_planks',null],['oak_planks','oak_planks',null]] },
        leatherworker:{ result: 'cauldron',          grid: [['iron_ingot',null,'iron_ingot'],['iron_ingot',null,'iron_ingot'],['iron_ingot','iron_ingot','iron_ingot']] },
        librarian:    { result: 'lectern',           grid: [['oak_slab','oak_slab','oak_slab'],[null,'bookshelf',null],[null,'oak_slab',null]] },
        mason:        { result: 'stonecutter',       grid: [[null,null,null],[null,'iron_ingot',null],['stone','stone','stone']] },
        shepherd:     { result: 'loom',              grid: [['string','string',null],['oak_planks','oak_planks',null],[null,null,null]] },
        toolsmith:    { result: 'smithing_table',    grid: [['iron_ingot','iron_ingot',null],['oak_planks','oak_planks',null],['oak_planks','oak_planks',null]] },
        weaponsmith:  { result: 'grindstone',        grid: [['stick','stone_slab','stick'],['oak_planks',null,'oak_planks'],[null,null,null]] },
    };

    // ── 3D Renderer ───────────────────────────────────────────────────
    function drawFace(ctx, img, [tl, tr, br, bl], brightness) {
        if (!img) return;
        const W = img.naturalWidth  || 16;
        const H = img.naturalHeight || 16;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y); ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y); ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.clip();
        ctx.transform(
            (tr.x - tl.x) / W, (tr.y - tl.y) / W,
            (bl.x - tl.x) / H, (bl.y - tl.y) / H,
            tl.x, tl.y
        );
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, W, H);
        if (brightness < 1) {
            ctx.globalAlpha = 1 - brightness;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();
    }

    function renderBlock(canvas, topImg, leftImg, rightImg, heightFactor = 1) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        const cw = canvas.width, ch = canvas.height;
        const bw = cw * 0.86, cx = cw / 2;
        const th = bw * 0.25;
        const sh = bw * 0.50 * heightFactor;
        // Slabs sit at the bottom of the canvas space
        const totalH = th * 2 + sh;
        const sy = (ch - totalH) / 2 + (ch * 0.5 - totalH * 0.5) * (1 - heightFactor);
        const A  = { x: cx,        y: sy };
        const L  = { x: cx - bw/2, y: sy + th };
        const M  = { x: cx,        y: sy + th * 2 };
        const R  = { x: cx + bw/2, y: sy + th };
        const BL = { x: cx - bw/2, y: sy + th + sh };
        const BC = { x: cx,        y: sy + th*2 + sh };
        const BR = { x: cx + bw/2, y: sy + th + sh };
        drawFace(ctx, leftImg,  [L, M, BC, BL], 0.68);
        drawFace(ctx, rightImg, [M, R, BR, BC], 0.54);
        drawFace(ctx, topImg,   [A, R, M,  L],  1.00);
    }

    async function renderLectern(canvas) {
        const [baseImg, frontImg, sidesImg, topImg] = await Promise.all([
            loadImg('block/lectern_base'),
            loadImg('block/lectern_front'),
            loadImg('block/lectern_sides'),
            loadImg('block/lectern_top'),
        ]);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;

        const cw = canvas.width, ch = canvas.height;
        const bw = cw * 0.86, cx = cw / 2;
        const th = bw * 0.25;
        const sh = bw * 0.50 * 0.65;

        // Base pedestal (65 % height), pushed up so book-rest fits below canvas top
        const sy = ch * 0.18;
        const A  = { x: cx,        y: sy };
        const L  = { x: cx - bw/2, y: sy + th };
        const M  = { x: cx,        y: sy + th * 2 };
        const R  = { x: cx + bw/2, y: sy + th };
        const BL = { x: cx - bw/2, y: sy + th + sh };
        const BC = { x: cx,        y: sy + th*2 + sh };
        const BR = { x: cx + bw/2, y: sy + th + sh };

        drawFace(ctx, sidesImg, [L,  M,  BC, BL], 0.68);
        drawFace(ctx, frontImg, [M,  R,  BR, BC], 0.54);
        drawFace(ctx, baseImg,  [A,  R,  M,  L],  1.00);

        // Book-rest: tilted panel rising from the back edge of the base top
        const restH = bw * 0.40;
        const dx    = bw * 0.03;  // slight forward lean
        const tL = { x: L.x + dx, y: L.y - restH };
        const tR = { x: R.x + dx, y: R.y - restH };
        const tA = { x: A.x + dx, y: A.y - restH };

        // Left-edge sliver of the rest (gives it thickness)
        drawFace(ctx, sidesImg, [tA, tL, L, A], 0.55);
        // Main reading surface
        drawFace(ctx, topImg,   [tL, tR, R, L], 0.88);
    }

    async function renderTex(canvas, def) {
        if (!def || !canvas) return;
        if (def.custom === 'lectern') return renderLectern(canvas);
        if (def.flat) {
            const img = await loadImg(def.flat);
            if (!img) return;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else {
            const topPath   = def.top  || def.all;
            const leftPath  = def.left || def.side || def.all;
            const rightPath = def.right || def.left || def.side || def.all;
            const [t, l, r] = await Promise.all([loadImg(topPath), loadImg(leftPath), loadImg(rightPath)]);
            renderBlock(canvas, t, l, r, def.slab ? 0.5 : 1);
        }
    }

    function mkCanvas(size) {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        c.style.cssText = 'display:block;image-rendering:pixelated;';
        return c;
    }

    // ── Modal ─────────────────────────────────────────────────────────
    let _modal = null, _rendered = false;

    function open()  { if (_modal) { _modal.classList.add('cw-open'); if (!_rendered) { _rendered = true; _renderAll(); } } }
    function close() { if (_modal) _modal.classList.remove('cw-open'); }

    async function _renderAll() {
        for (const slot of _modal.querySelectorAll('.cw-slot[data-item]')) {
            const def = ITEMS[slot.dataset.item];
            await renderTex(slot.querySelector('canvas'), def);
        }
        const res = _modal.querySelector('.cw-result[data-block]');
        if (res) await renderTex(res.querySelector('canvas'), BLOCKS[res.dataset.block]);
    }

    function buildModal(recipe, block) {
        const el = document.createElement('div');
        el.className = 'cw-overlay';
        el.innerHTML = `
            <div class="cw-backdrop"></div>
            <div class="cw-window">
                <div class="cw-inner">
                    <div class="cw-titlebar">
                        <span>Crafting Recipe — ${block.name}</span>
                        <button class="cw-closebtn" aria-label="Close">✕</button>
                    </div>
                    <div class="cw-area">
                        <div class="cw-grid"></div>
                        <svg class="cw-arrow" viewBox="0 0 48 26" xmlns="http://www.w3.org/2000/svg" style="image-rendering:pixelated">
                            <rect x="0" y="9"  width="34" height="8" fill="#c6c6c6"/>
                            <rect x="0" y="9"  width="34" height="2" fill="#777"/>
                            <rect x="0" y="15" width="34" height="2" fill="#fff"/>
                            <rect x="34" y="3"  width="4" height="20" fill="#c6c6c6"/>
                            <rect x="38" y="7"  width="4" height="12" fill="#c6c6c6"/>
                            <rect x="42" y="11" width="4" height="4"  fill="#c6c6c6"/>
                            <rect x="46" y="12" width="2" height="2"  fill="#c6c6c6"/>
                            <rect x="34" y="3"  width="4" height="2"  fill="#777"/>
                            <rect x="38" y="7"  width="4" height="2"  fill="#777"/>
                            <rect x="42" y="11" width="4" height="2"  fill="#777"/>
                            <rect x="34" y="21" width="4" height="2"  fill="#fff"/>
                            <rect x="38" y="17" width="4" height="2"  fill="#fff"/>
                            <rect x="42" y="13" width="4" height="2"  fill="#fff"/>
                        </svg>
                        <div class="cw-result" data-block="${recipe.result}" data-tip="${block.name}"></div>
                    </div>
                </div>
            </div>`;

        // Grid slots
        const grid = el.querySelector('.cw-grid');
        recipe.grid.flat().forEach(item => {
            const slot = document.createElement('div');
            if (item) {
                slot.className = 'cw-slot';
                slot.dataset.item = item;
                slot.dataset.tip  = ITEMS[item]?.name || '';
                slot.appendChild(mkCanvas(38));
            } else {
                slot.className = 'cw-slot cw-empty';
            }
            grid.appendChild(slot);
        });

        // Result canvas
        el.querySelector('.cw-result').appendChild(mkCanvas(50));

        el.querySelector('.cw-closebtn').addEventListener('click', close);
        el.querySelector('.cw-backdrop').addEventListener('click', close);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

        return el;
    }

    // ── Init ──────────────────────────────────────────────────────────
    async function init() {
        const page   = location.pathname.split('/').pop().replace('.html', '');
        const recipe = RECIPES[page];
        if (!recipe) return;
        const block = BLOCKS[recipe.result];
        if (!block) return;

        _modal = buildModal(recipe, block);
        document.body.appendChild(_modal);

        // Button
        const btn = document.createElement('button');
        btn.className = 'cw-btn';
        btn.title = block.name + ' crafting recipe';
        const ic = mkCanvas(44);
        ic.className = 'cw-btn__icon';
        btn.appendChild(ic);
        const lbl = document.createElement('span');
        lbl.textContent = 'Recipe';
        btn.appendChild(lbl);
        btn.addEventListener('click', open);
        document.body.appendChild(btn);

        // Render button icon
        renderTex(ic, block);
    }

    document.addEventListener('DOMContentLoaded', init);
    global.CraftingWidget = { open, close };

})(window);
