// Defina o caminho para o seu arquivo PDF
const pdfUrl = 'Boletim.pdf'; // << IMPORTANTE: Renomeie seu arquivo PDF para 'boletim.pdf'

// Defina o workerSrc para o pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

const flipbook = $('#flipbook' );
const prevBtn = $('#prevBtn');
const nextBtn = $('#nextBtn');

async function initializeFlipbook() {
    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const totalPages = pdf.numPages;

        // Pega a primeira página para determinar as dimensões
        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1.5 }); // Escala para melhor qualidade
        
        // Calcula a largura e altura para o flipbook duplo (side-by-side)
        const flipbookWidth = viewport.width * 2;
        const flipbookHeight = viewport.height;

        flipbook.css({
            width: flipbookWidth + 'px',
            height: flipbookHeight + 'px'
        });

        // Renderiza todas as páginas do PDF
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const pageViewport = page.getViewport({ scale: 1.5 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = pageViewport.height;
            canvas.width = pageViewport.width;

            await page.render({ canvasContext: context, viewport: pageViewport }).promise;

            const pageDiv = $('<div>').addClass('page').append(canvas);
            flipbook.append(pageDiv);
        }

        // Inicializa o turn.js DEPOIS que todas as páginas foram adicionadas
        flipbook.turn({
            width: flipbookWidth,
            height: flipbookHeight,
            autoCenter: true,
            elevation: 50,
            gradients: true
        });

    } catch (error) {
        console.error("Erro ao carregar ou renderizar o PDF:", error);
        flipbook.html('<p>Ocorreu um erro ao carregar o boletim. Verifique se o arquivo "boletim.pdf" está na pasta correta.</p>');
    }
}

// Controles de navegação
prevBtn.on('click', () => {
    flipbook.turn('previous');
});

nextBtn.on('click', () => {
    flipbook.turn('next');
});

// Inicia o processo
initializeFlipbook();

