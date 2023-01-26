import { defineComponent } from "vue";
import * as Diff from 'diff'

export default defineComponent({
    setup() {

    },
    data() {
        return {
            oldText: "Selama 24 jam sahaja pada 26 Januari 2023, nikmati pelbagai tawaran menarik sempena Lazada January Exclusive Deals. Telekung serendah RM158 beserta hadiah PERCUMA",
            newText: "Selama 24  sahaja pada 26 Januari 2023, nikmati pelbagai tawaran menarik sempena Lazada January Exclusive Deals. Telekung serendah RM158 beserta hadiah FREE",
            comparedText: ""
        }
    },
    methods:{
    },
    computed: {
        comparedOutput() {
            let returner:any = ""
            const diff = Diff.diffWords(this.oldText, this.newText),
            display = document.getElementById('display'),
            fragment = document.createDocumentFragment();
            let span;
        
            diff.forEach((part: any) => {
            // green for additions, red for deletions
            // grey for common parts
            const color = part.added ? 'green' :
                part.removed ? 'red' : 'grey';
            span = document.createElement('span');
            span.classList.add("thisisu")
            span.style.color = color;
            span.appendChild(document
                .createTextNode(part.value));
            fragment.appendChild(span);
            });
            display?.appendChild(fragment);

            return returner
        }
    }
})