// Improved calculator script — more robust parsing, money formatting while typing,
// division-by-zero handling, op button active state, and initial mode detection.

document.addEventListener('DOMContentLoaded', () => {
    const displayEl = document.getElementById('display');
    const opArea = document.getElementById('opArea');
    const keys = document.getElementById('keys');
    const navButtons = Array.from(document.querySelectorAll('nav button'));

    if (!displayEl || !opArea || !keys) {
        console.warn('Calculator: required DOM elements not found (display/opArea/keys).');
        return;
    }

    // start mode from nav active button if present
    let mode = navButtons.find(b => b.classList.contains('active'))?.dataset.mode || 'sum'; // 'sum', 'mul', 'money'
    let current = '';
    let acc = null;
    let oper = null;
    let lastOperand = null;

    const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const opsByMode = {
        sum: ['+', '-'],
        mul: ['*', '/'],
        money: ['+', '-', '*', '/']
    };

    function setMode(m) {
        mode = m;
        navButtons.forEach(b => b.classList.toggle('active', b.dataset.mode === m));
        renderOps();
        resetAll();
        updateDisplay();
    }

    function renderOps() {
        opArea.innerHTML = '';
        (opsByMode[mode] || []).forEach(op => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'op-btn';
            btn.textContent = op === '*' ? '×' : (op === '/' ? '÷' : op);
            btn.dataset.op = op;
            if (oper === op) btn.classList.add('active');
            opArea.appendChild(btn);
        });
    }

    function resetAll() {
        current = '';
        acc = null;
        oper = null;
        lastOperand = null;
    }

    function updateDisplay() {
        // money mode: format accumulated value or typed value where possible
        if (mode === 'money') {
            if (current !== '' && current !== '-' && current !== '.') {
                const n = parseCurr(current);
                if (!Number.isNaN(n)) {
                    displayEl.textContent = currencyFormatter.format(n);
                    return;
                }
            }
            if (current !== '') {
                displayEl.textContent = current;
                return;
            }
            if (acc !== null) {
                displayEl.textContent = currencyFormatter.format(acc);
                return;
            }
            displayEl.textContent = '0,00';
            return;
        }

        // non-money modes
        if (current !== '') {
            displayEl.textContent = current;
        } else if (acc !== null) {
            displayEl.textContent = String(acc);
        } else {
            displayEl.textContent = '0';
        }
    }

    // parse typed current string to number; accept comma or dot as decimal separator
    function parseCurr(s) {
        if (s === '' || s === '-') return 0;
        const cleaned = String(s).replace(/\s/g, '').replace(',', '.');
        return parseFloat(cleaned);
    }

    function pressDigit(d) {
        if (d === '.' || d === ',') {
            // normalize to dot internally
            if (current.includes('.')) return;
            current = current === '' ? '0.' : current + '.';
        } else if (d === '+/-') {
            if (current.startsWith('-')) current = current.slice(1);
            else current = current ? '-' + current : '-';
        } else if (d === 'del') {
            current = current.slice(0, -1);
        } else if (d === 'C') {
            resetAll();
        } else {
            // digit
            if (current === '0') current = d; // avoid leading zeros
            else current += d;
        }
        updateDisplay();
    }

    function applyOperation(a, b, op) {
        if (op === '+') return a + b;
        if (op === '-') return a - b;
        if (op === '*') return a * b;
        if (op === '/') {
            if (b === 0) return NaN; // signal error
            return a / b;
        }
        return b;
    }

    function pressOp(op) {
        // allow changing operator if user presses an operator after an operator (no current)
        if (current === '' && acc === null) return;
        if (current !== '') {
            const val = parseCurr(current);
            if (acc === null) acc = val;
            else if (oper) acc = applyOperation(acc, val, oper);
            else acc = val;
            lastOperand = val;
            current = '';
        }
        oper = op;
        renderOps();
        updateDisplay();
    }

    function pressEquals() {
        if (oper === null) return;
        if (current !== '') {
            const val = parseCurr(current);
            acc = applyOperation(acc === null ? 0 : acc, val, oper);
            lastOperand = val;
            current = '';
        } else if (lastOperand !== null) {
            acc = applyOperation(acc === null ? 0 : acc, lastOperand, oper);
        }
        // handle division by zero or other invalid results
        if (!Number.isFinite(acc)) {
            displayEl.textContent = 'Erro';
            // reset state but keep display showing error briefly until user clears
            acc = null;
            oper = null;
            lastOperand = null;
            current = '';
            return;
        }
        updateDisplay();
    }

    // keypad clicks
    keys.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const k = btn.dataset.key;
        if (!k) return;
        if (k === '=') { pressEquals(); return; }
        if (k === 'C') { pressDigit('C'); return; }
        if (k === 'del') { pressDigit('del'); return; }
        if (k === '+/-') { pressDigit('+/-'); return; }
        if (k === '.' || k === ',') { pressDigit('.'); return; }
        if (/\d/.test(k)) pressDigit(k);
    });

    // operator clicks (delegated)
    opArea.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        const op = b.dataset.op;
        if (!op) return;
        pressOp(op);
    });

    // nav buttons
    navButtons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode || 'sum')));

    // keyboard support
    window.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') { pressDigit(e.key); e.preventDefault(); }
        else if (e.key === '.' || e.key === ',') { pressDigit('.'); e.preventDefault(); }
        else if (e.key === 'Backspace') { pressDigit('del'); e.preventDefault(); }
        else if (e.key === 'Delete') { pressDigit('C'); e.preventDefault(); }
        else if (e.key === 'Enter' || e.key === '=') { pressEquals(); e.preventDefault(); }
        else if (['+','-','*','/'].includes(e.key)) { pressOp(e.key); e.preventDefault(); }
    });
    renderOps();
    updateDisplay();
});