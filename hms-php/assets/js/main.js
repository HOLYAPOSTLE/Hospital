/**
 * Hospital Management System - Core Client JS Utilities
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Client-Side BS5 Form Validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // 2. Billing Calculator
    const drugSelect = document.getElementById('billingDrugSelect');
    const labSelect = document.getElementById('billingLabSelect');
    const insuranceDeductionInput = document.getElementById('billingInsuranceDeduction');
    const billingTotalInput = document.getElementById('billingTotal');
    const billingFinalInput = document.getElementById('billingFinal');

    if (drugSelect && labSelect && billingTotalInput && billingFinalInput) {
        
        function recalculatePaymentAmount() {
            let total = 0;
            
            // Get consultation fee
            const consultFee = parseFloat(document.getElementById('billingConsultFee')?.value || 50.00);
            total += consultFee;
            
            // Sum selected drugs
            if (drugSelect) {
                Array.from(drugSelect.selectedOptions).forEach(option => {
                    const price = parseFloat(option.getAttribute('data-price') || 0);
                    total += price;
                });
            }
            
            // Sum selected lab tests
            if (labSelect) {
                Array.from(labSelect.selectedOptions).forEach(option => {
                    const price = parseFloat(option.getAttribute('data-price') || 0);
                    total += price;
                });
            }

            billingTotalInput.value = total.toFixed(2);
            
            // Apply insurance reduction if any
            let reduction = 0;
            if (insuranceDeductionInput) {
                const reductionPercentage = parseFloat(insuranceDeductionInput.getAttribute('data-percentage') || 0);
                reduction = total * (reductionPercentage / 100);
                insuranceDeductionInput.value = reduction.toFixed(2);
            }
            
            const finalAmount = Math.max(0, total - reduction);
            billingFinalInput.value = finalAmount.toFixed(2);
        }

        // Add event listeners to trigger recalculation
        drugSelect.addEventListener('change', recalculatePaymentAmount);
        labSelect.addEventListener('change', recalculatePaymentAmount);
        recalculatePaymentAmount();
    }
});
