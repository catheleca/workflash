
"use strict";

// ==========================================
// ANO AUTOMÁTICO NO RODAPÉ
// ==========================================

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// ==========================================
// IDENTIFICAÇÃO DA ORIGEM DO LEAD
// ==========================================

const params = new URLSearchParams(window.location.search);
const source = document.getElementById("lead-source");

if (source && params.get("origem")) {
    source.value = params.get("origem").slice(0, 150);
}


// ==========================================
// MÁSCARA DE TELEFONE
// ==========================================

const phone = document.getElementById("phone");

if (phone) {

    phone.addEventListener("input", () => {

        let digits = phone.value.replace(/\D/g, "").slice(0, 11);

        if (digits.length > 10) {
            digits = digits.replace(
                /^(\d{2})(\d{5})(\d{4})$/,
                "($1) $2-$3"
            );
        } else if (digits.length > 6) {
            digits = digits.replace(
                /^(\d{2})(\d{4})(\d{0,4})$/,
                "($1) $2-$3"
            );
        } else if (digits.length > 2) {
            digits = digits.replace(
                /^(\d{2})(\d+)$/,
                "($1) $2"
            );
        }

        phone.value = digits;

    });

}


// ==========================================
// FORMULÁRIO DE DIAGNÓSTICO
// ==========================================

const form = document.getElementById("diagnosis-form");
const status = document.getElementById("form-status");

if (form && status) {

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent.trim();

    function showStatus(message, type) {
        status.textContent = message;
        status.className = type;
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (button.disabled) return;

        if (!form.reportValidity()) return;

        // Validação do WhatsApp

        const phoneDigits = phone.value.replace(/\D/g, "");

        if (phoneDigits.length < 10 || phoneDigits.length > 11) {

            showStatus(
                "Por favor, informe um telefone válido com DDD.",
                "error"
            );

            phone.focus();
            return;
        }

        // Validação do e-mail

        const email = document.getElementById("email");
        const emailValue = email.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue && !emailRegex.test(emailValue)) {

            showStatus(
                "Por favor, informe um endereço de e-mail válido.",
                "error"
            );

            email.focus();
            return;
        }

        // Verifica se pelo menos um desafio foi selecionado

        const challenges = form.querySelectorAll(
            'input[name="challenges"]:checked'
        );

        if (challenges.length === 0) {

            showStatus(
                "Selecione pelo menos um dos seus principais desafios.",
                "error"
            );

            form.querySelector(
                'input[name="challenges"]'
            ).focus();

            return;
        }

        // Verifica a configuração do endpoint

        if (form.action.includes("SEU_ID")) {

            showStatus(
                "Formulário ainda não configurado. Entre em contato pelo WhatsApp.",
                "error"
            );

            return;
        }

        // Prepara os dados

        const formData = new FormData(form);

        // Remove o e-mail da requisição caso esteja vazio

        if (!emailValue) {
            formData.delete("email");
        }

        formData.set(
            "challenges",
            Array.from(challenges)
                .map(item => item.value)
                .join("; ")
        );

        button.disabled = true;
        button.textContent = "Enviando solicitação...";

        status.textContent = "";
        status.className = "";

        try {

            const response = await fetch(form.action, {

                method: "POST",

                body: formData,

                headers: {
                    "Accept": "application/json"
                }

            });

            if (!response.ok) {

                const errorData = await response.json();

                console.error("Erro Formspree:", errorData);

                const errors = errorData.errors || [];

                const emailError = errors.some(
                    error => error.field === "email"
                );

                if (emailError) {

                    showStatus(
                        "O endereço de e-mail informado é inválido. Verifique e tente novamente.",
                        "error"
                    );

                    email.focus();
                    return;
                }

                throw new Error("Falha no envio");
            }

            // Envio concluído

            form.reset();

            if (source && params.get("origem")) {
                source.value = params.get("origem").slice(0, 150);
            }

            showStatus(
                "Solicitação recebida com sucesso! " +
                "Agradecemos seu interesse na Workflash. " +
                "Nossa equipe entrará em contato em breve.",
                "success"
            );

        } catch (error) {

            showStatus(
                "Não foi possível enviar sua solicitação. " +
                "Tente novamente ou fale conosco pelo WhatsApp.",
                "error"
            );

            console.error("Erro no envio:", error);

        } finally {

            button.disabled = false;
            button.textContent = originalText;

        }

    });

}

// ==========================================
// VALIDAÇÃO VISUAL DO E-MAIL
// ==========================================

const emailField = document.getElementById("email");
const emailErrorMessage = document.getElementById("email-error");

if (emailField && emailErrorMessage) {

    function validateEmail() {

        const value = emailField.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const valid = value === "" ||
            (regex.test(value) && emailField.validity.valid);

        if (!valid) {

            emailErrorMessage.textContent =
                "Informe um endereço de e-mail válido. Ex.: nome@empresa.com.br.";

            emailField.classList.add("input-error");
            emailField.setAttribute("aria-invalid", "true");

        } else {

            emailErrorMessage.textContent = "";

            emailField.classList.remove("input-error");
            emailField.removeAttribute("aria-invalid");

        }

        return valid;
    }

    // Valida quando o usuário sai do campo
    emailField.addEventListener("blur", validateEmail);

    // Valida quando o HTML bloqueia o envio
    emailField.addEventListener("invalid", validateEmail);

    // Atualiza o aviso enquanto o usuário corrige
    emailField.addEventListener("input", () => {

        if (emailField.classList.contains("input-error")) {
            validateEmail();
        }

    });

}
// ==========================================
// VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
// ==========================================

const requiredMessages = {
    name: "Por favor, informe seu nome.",
    company: "Por favor, informe o nome da empresa.",
    phone: "Por favor, informe seu WhatsApp com DDD.",
    segment: "Selecione o segmento da sua empresa.",
    city: "Por favor, informe sua cidade.",
    consent: "É necessário autorizar o contato para continuar."
};

const requiredFields = document.querySelectorAll(
    "#diagnosis-form [required]"
);

requiredFields.forEach((field) => {

    // Preserva a validação específica do e-mail
    if (field.id === "email") return;

    // Cria a mensagem de erro automaticamente
    const error = document.createElement("span");

    error.className = "field-error";
    error.id = `${field.id || field.name}-error`;

    error.setAttribute("aria-live", "polite");

    field.setAttribute("aria-describedby", error.id);

    // Posiciona a mensagem abaixo do campo
    if (field.type === "checkbox") {
        field.closest("label").after(error);
    } else {
        field.after(error);
    }

    function validateField() {

        const valid = field.validity.valid;

        if (!valid) {

            error.textContent =
                requiredMessages[field.name] ||
                "Por favor, preencha este campo.";

            field.classList.add("input-error");
            field.setAttribute("aria-invalid", "true");

        } else {

            error.textContent = "";

            field.classList.remove("input-error");
            field.removeAttribute("aria-invalid");

        }

        return valid;
    }

    // Valida quando o envio é bloqueado
    field.addEventListener("invalid", validateField);

    // Valida quando o usuário sai do campo
    field.addEventListener("blur", validateField);

    // Remove o erro quando o usuário corrige
    field.addEventListener("input", () => {

        if (field.classList.contains("input-error")) {
            validateField();
        }

    });

    field.addEventListener("change", () => {

        if (field.classList.contains("input-error")) {
            validateField();
        }

    });

    // Limpa os avisos quando o formulário é resetado
    field.form.addEventListener("reset", () => {

        error.textContent = "";
        field.classList.remove("input-error");
        field.removeAttribute("aria-invalid");

    });

});