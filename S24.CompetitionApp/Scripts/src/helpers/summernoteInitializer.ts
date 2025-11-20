// summernoteInitializer.ts
import * as $ from "jquery";

export class SummernoteInitializer {
    public static initializeSummernote(selector: string | JQuery): void {
        const $textarea = typeof selector === 'string' ? $(selector) : selector;
        
        if ($textarea.length === 0) {
            console.warn('Summernote: textarea element not found');
            return;
        }

        const initSummernote = () => {
            ($textarea as any).summernote({
                height: 200,
                focus: false,
                placeholder: 'Skriv inn beskrivelse her...',
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['font', ['strikethrough']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link']],
                    ['view', ['fullscreen', 'codeview']]
                ],
                callbacks: {
                    onChange: function(contents: string) {
                        $textarea.val(contents);
                    },
                    onInit: function() {
                        SummernoteInitializer.applySummernoteStyles();
                    }
                }
            });

            // Дополнительный фикс через короткое время
            setTimeout(() => {
                SummernoteInitializer.applySummernoteStyles();
            }, 200);
        };

        if (document.readyState === 'complete') {
            initSummernote();
        } else {
            $(document).ready(function() {
                setTimeout(initSummernote, 100);
            });
        }
    }

    public static getContent(selector: string | JQuery): string {
        const $textarea = typeof selector === 'string' ? $(selector) : selector;
        return ($textarea as any).summernote('code');
    }

    public static setContent(selector: string | JQuery, content: string): void {
        const $textarea = typeof selector === 'string' ? $(selector) : selector;
        ($textarea as any).summernote('code', content || '');
        
        setTimeout(() => {
            SummernoteInitializer.applySummernoteStyles();
        }, 50);
    }

    public static destroy(selector: string | JQuery): void {
        const $textarea = typeof selector === 'string' ? $(selector) : selector;
        if (($textarea as any).summernote) {
            ($textarea as any).summernote('destroy');
        }
    }

    private static applySummernoteStyles(): void {
        const $editor = $('.note-editor');
        const $toolbar = $('.note-toolbar');
        const $editable = $('.note-editable');
        const $codable = $('.note-codable');
        
        $editable.css({
            'background-color': '#ffffff',
            'color': '#333333',
            'display': 'block'
        });
        
        $toolbar.css({
            'background-color': '#f5f5f5',
            'border-bottom': '1px solid #ddd'
        });
        
        // Принудительно скрываем codable
        $codable.hide();
        
        // Принудительно перезагружаем шрифты
        SummernoteInitializer.loadSummernoteFonts();
        
        // Принудительный reflow для иконок
        if ($toolbar.length) {
            $toolbar.hide().show();
        }
    }

    private static loadSummernoteFonts(): void {
        // Проверяем, не добавлены ли уже стили
        if ($('#summernote-fonts-style').length > 0) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'summernote-fonts-style';
        style.textContent = `
            @font-face {
                font-family: 'summernote';
                font-style: normal;
                font-weight: normal;
                src: url('../fonts/summernote.eot');
                src: url('../fonts/summernote.eot?#iefix') format('embedded-opentype'),
                     url('../fonts/summernote.woff2') format('woff2'),
                     url('../fonts/summernote.woff') format('woff'),
                     url('../fonts/summernote.ttf') format('truetype');
            }
        `;
        document.head.appendChild(style);
    }
}