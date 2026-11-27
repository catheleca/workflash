
"use strict";

// ==========================================
// MENU RESPONSIVO
// ==========================================

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (toggle && nav) {

    toggle.addEventListener("click", () => {
        const open = toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}


// ==========================================
// ATUALIZAÇÃO AUTOMÁTICA DO ANO NO RODAPÉ
// ==========================================

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// ==========================================
// FORMULÁRIO DE CONTATO - FORMSPREE
// ==========================================

const form = document.getElementById("contact-form");

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!form.reportValidity()) return;

        const status = document.getElementById("form-status");
        const button = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);

        // Bloqueia o botão durante o envio
        button.disabled = true;
        button.textContent = "Enviando mensagem...";

        status.textContent = "";
        status.style.color = "";

        try {

            // Envia os dados para o Formspree
            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                // Confirmação de sucesso
                status.textContent =
                    "Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.";

                status.style.color = "#059669";
                status.style.fontWeight = "600";

                // Limpa os campos do formulário
                form.reset();

            } else {
                throw new Error("Falha no envio do formulário.");
            }

        } catch (error) {

            // Mensagem de erro
            status.textContent =
                "Não foi possível enviar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp.";

            status.style.color = "#dc2626";

            console.error("Erro no formulário:", error);

        } finally {

            // Libera o botão novamente
            button.disabled = false;
            button.textContent = "Enviar mensagem ↗";

        }

    });

}
