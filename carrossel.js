// Espera o documento carregar para garantir que todos os elementos existem
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    if (!slider) return; // Para a execução se o slider não for encontrado

    const cards = Array.from(document.querySelectorAll('.card'));
    const dotsContainer = document.getElementById('dots');
    const viewport = document.querySelector('.viewport');

    let currentIndex = 0;
    let containerWidth = 0;
    let cardWidth = 0;
    let singleCardWidth = 0;
    let centerOffset = 0;

    let isDragging = false;
    let startX = 0;
    let prevTranslate = 0;
    let currentTranslate = 0;
    let pointerId = null;

    // Adiciona um botão a cada card
	cards.forEach((card, i) => {
		const footer = card.querySelector('.card-footer');
		if (footer) {
			const btn = document.createElement('button');
			btn.textContent = 'VER DETALHES';

			btn.addEventListener('click', (e) => {
				e.stopPropagation(); // Mantém isso para evitar que o clique se propague para o card pai

				// A linha abaixo é a que faz o redirecionamento
				window.location.href = 'pagina1.html'; 
			});

			footer.appendChild(btn);
		}
	});

    // Cria os pontos de navegação
    cards.forEach((_, i) => {
        const d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => {
            currentIndex = i;
            snapToIndex();
        });
        dotsContainer.appendChild(d);
    });
    const dots = Array.from(document.querySelectorAll('.dot'));

    // Pega o valor do 'gap' definido no CSS
    function getGap() {
        const g = getComputedStyle(slider).gap || '0px';
        return parseFloat(g) || 0;
    }

    // Recalcula todas as dimensões
    function recalcSizes(){
        if (cards.length === 0) return;
        containerWidth = viewport.clientWidth;
        singleCardWidth = cards[0].offsetWidth;
        const gap = getGap();
        cardWidth = singleCardWidth + gap;
        centerOffset = (containerWidth - singleCardWidth) / 2;
        const off = calcTranslateForIndex(currentIndex);
        setTranslate(off, false);
        updateActiveClass();
    }

    // Calcula a posição X para centralizar um card
    function calcTranslateForIndex(index){
        return Math.round(-index * cardWidth + centerOffset);
    }

    // Aplica a transformação no slider
    function setTranslate(x, withTransition = true){
        slider.style.transition = withTransition ? 'transform 300ms cubic-bezier(.22,.99,.38,1)' : 'none';
        slider.style.transform = `translateX(${x}px)`;
        currentTranslate = x;
    }

    // Atualiza a classe '.active' no card e no dot
    function updateActiveClass(){
        cards.forEach((c, i) => c.classList.toggle('active', i === currentIndex));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    // Anima o slider para a posição do índice atual
    function snapToIndex(){
        currentIndex = Math.max(0, Math.min(cards.length - 1, currentIndex));
        const target = calcTranslateForIndex(currentIndex);
        setTranslate(target, true);
        updateActiveClass();
    }

    // Handlers de arrastar (Pointer Events)
    function onPointerDown(e){
        if (e.target.tagName === 'BUTTON') return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        isDragging = true;
        pointerId = e.pointerId;
        startX = e.clientX;
        prevTranslate = currentTranslate;
        try { e.target.setPointerCapture(pointerId); } catch(_) {}
        setTranslate(currentTranslate, false);
        document.body.classList.add('grabbing');
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e){
        if (!isDragging || (pointerId != null && e.pointerId !== pointerId)) return;
        const dx = e.clientX - startX;
        const x = prevTranslate + dx;
        setTranslate(x, false);
    }

    function onPointerUp(e){
        if (!isDragging) return;
        try { e.target.releasePointerCapture && e.target.releasePointerCapture(pointerId); } catch(_) {}
        isDragging = false;
        pointerId = null;
        document.body.classList.remove('grabbing');
        const unrounded = -(currentTranslate - centerOffset) / cardWidth;
        currentIndex = Math.round(unrounded);
        snapToIndex();
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.removeEventListener('pointercancel', onPointerUp);
    }

    // Adiciona o evento de início de arraste a cada card
    cards.forEach(card => {
        card.addEventListener('pointerdown', onPointerDown);
        card.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Responsividade
    window.addEventListener('resize', () => {
        clearTimeout(window._carouselResize);
        window._carouselResize = setTimeout(recalcSizes, 100);
    });

    // Inicializa o carrossel
    recalcSizes();
    snapToIndex();
});
	//open apps -- inserted here --
	var app = qlik.openApp('teste3.qvf', config);



	//get objects -- inserted here --
	
