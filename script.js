document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const totalPledgeSlider = document.getElementById('totalPledge');
    const totalPledgeValue = document.getElementById('totalPledgeValue');
    const userBioXPInput = document.getElementById('userBioXP');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    
    // Constants
    const TOKENS_FOR_SALE = 77000; // $77k
    const MAX_ALLOCATION_PERCENT = 0.005; // 0.5%
    const INITIAL_FDV = 205000; // $205k
    const POTENTIAL_FDVS = [1000000, 5000000, 10000000, 50000000, 100000000]; // $1M, $5M, $10M, $50M, $100M
    
    // Range slider value update
    totalPledgeSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        totalPledgeValue.textContent = formatNumber(value);
    });
    
    // Calculate button
    calculateBtn.addEventListener('click', function() {
        calculateAllocation();
    });
    
    // Calculate with Enter key
    userBioXPInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateAllocation();
        }
    });
    
    // Main calculation function
    function calculateAllocation() {
        const totalPledge = parseInt(totalPledgeSlider.value);
        const userBioXP = parseInt(userBioXPInput.value);
        
        // Validation
        if (!userBioXP || userBioXP < 0) {
            alert('Please enter a valid BioXP score');
            return;
        }
        
        // Allocation calculation formula
        const normalCalculation = (userBioXP / totalPledge) * TOKENS_FOR_SALE;
        const maxLimit = MAX_ALLOCATION_PERCENT * TOKENS_FOR_SALE;
        const userAllocation = Math.min(normalCalculation, maxLimit);
        
        // BioXP ratio
        const bioXPRatio = (userBioXP / totalPledge) * 100;
        
        // Potential return calculation - for all FDV levels
        const potentialValues = POTENTIAL_FDVS.map(fdv => (userAllocation / TOKENS_FOR_SALE) * fdv);
        
        // Multiplier calculation (how many x)
        const multipliers = POTENTIAL_FDVS.map(fdv => (fdv / TOKENS_FOR_SALE).toFixed(1));
        
        // Display results
        displayResults({
            allocation: userAllocation,
            bioXPRatio: bioXPRatio,
            maxLimit: maxLimit,
            normalCalculation: normalCalculation,
            potentialValues: potentialValues,
            multipliers: multipliers
        });
        
        // Make results visible
        resultsSection.style.display = 'block';
        
        // Smooth scroll
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Display results
    function displayResults(results) {
        document.getElementById('allocationResult').textContent = formatCurrency(results.allocation);
        document.getElementById('bioXPRatio').textContent = results.bioXPRatio.toFixed(4) + '%';
        document.getElementById('maxLimit').textContent = formatCurrency(results.maxLimit);
        document.getElementById('normalCalculation').textContent = formatCurrency(results.normalCalculation);
        document.getElementById('maxLimitDetail').textContent = formatCurrency(results.maxLimit);
        document.getElementById('finalResult').textContent = formatCurrency(results.allocation);
        
        // Display all potential values and multipliers
        document.getElementById('potentialValue1M').textContent = formatCurrency(results.potentialValues[0]);
        document.getElementById('multiplier1M').textContent = results.multipliers[0] + 'x';
        
        document.getElementById('potentialValue5M').textContent = formatCurrency(results.potentialValues[1]);
        document.getElementById('multiplier5M').textContent = results.multipliers[1] + 'x';
        
        document.getElementById('potentialValue10M').textContent = formatCurrency(results.potentialValues[2]);
        document.getElementById('multiplier10M').textContent = results.multipliers[2] + 'x';
        
        document.getElementById('potentialValue50M').textContent = formatCurrency(results.potentialValues[3]);
        document.getElementById('multiplier50M').textContent = results.multipliers[3] + 'x';
        
        document.getElementById('potentialValue100M').textContent = formatCurrency(results.potentialValues[4]);
        document.getElementById('multiplier100M').textContent = results.multipliers[4] + 'x';
    }
    
    // Number formatting (1,000,000)
    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }
    
    // Currency formatting ($1,234.56)
    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Example calculation on page load
    setTimeout(() => {
        userBioXPInput.value = '100000';
        calculateAllocation();
    }, 500);
    
    // Clear placeholder when input is focused
    userBioXPInput.addEventListener('focus', function() {
        if (this.value === '100000') {
            this.value = '';
        }
    });
    
    // Restore example value if input is empty when blurred
    userBioXPInput.addEventListener('blur', function() {
        if (!this.value) {
            this.value = '100000';
        }
    });
    
    // Tooltip-like display for range slider
    totalPledgeSlider.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const value = this.min + (this.max - this.min) * percent;
        
        // Show tooltip (optional)
        this.title = formatNumber(Math.round(value));
    });
    
    // Additional controls for responsive design
    function handleResize() {
        if (window.innerWidth <= 768) {
            // Mobile optimizations
            document.body.style.fontSize = '14px';
        } else {
            document.body.style.fontSize = '16px';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial load
});
