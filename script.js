document.addEventListener('DOMContentLoaded', function() {
    // DOM elementleri
    const totalPledgeSlider = document.getElementById('totalPledge');
    const totalPledgeValue = document.getElementById('totalPledgeValue');
    const userBioXPInput = document.getElementById('userBioXP');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    
    // Sabitler
    const TOKENS_FOR_SALE = 77000; // $77k
    const MAX_ALLOCATION_PERCENT = 0.005; // %0.5
    const INITIAL_FDV = 205000; // $205k
    const POTENTIAL_FDVS = [1000000, 5000000, 10000000, 50000000, 100000000]; // $1M, $5M, $10M, $50M, $100M
    
    // Range slider değer güncelleme
    totalPledgeSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        totalPledgeValue.textContent = formatNumber(value);
    });
    
    // Hesaplama butonu
    calculateBtn.addEventListener('click', function() {
        calculateAllocation();
    });
    
    // Enter tuşu ile hesaplama
    userBioXPInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateAllocation();
        }
    });
    
    // Ana hesaplama fonksiyonu
    function calculateAllocation() {
        const totalPledge = parseInt(totalPledgeSlider.value);
        const userBioXP = parseInt(userBioXPInput.value);
        
        // Validation
        if (!userBioXP || userBioXP < 0) {
            alert('Please enter a valid BioXP score');
            return;
        }
        
        // Allocation hesaplama formülü
        const normalCalculation = (userBioXP / totalPledge) * TOKENS_FOR_SALE;
        const maxLimit = MAX_ALLOCATION_PERCENT * TOKENS_FOR_SALE;
        const userAllocation = Math.min(normalCalculation, maxLimit);
        
        // BioXP oranı
        const bioXPRatio = (userBioXP / totalPledge) * 100;
        
        // Potansiyel getiri hesaplama - tüm FDV seviyeleri için
        const potentialValues = POTENTIAL_FDVS.map(fdv => (userAllocation / INITIAL_FDV) * fdv);
        
        // Multiplier hesaplama (kaç x)
        const multipliers = POTENTIAL_FDVS.map(fdv => (fdv / INITIAL_FDV).toFixed(1));
        
        // Sonuçları göster
        displayResults({
            allocation: userAllocation,
            bioXPRatio: bioXPRatio,
            maxLimit: maxLimit,
            normalCalculation: normalCalculation,
            potentialValues: potentialValues,
            multipliers: multipliers
        });
        
        // Sonuçları görünür yap
        resultsSection.style.display = 'block';
        
        // Smooth scroll
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Sonuçları gösterme
    function displayResults(results) {
        document.getElementById('allocationResult').textContent = formatCurrency(results.allocation);
        document.getElementById('bioXPRatio').textContent = results.bioXPRatio.toFixed(4) + '%';
        document.getElementById('maxLimit').textContent = formatCurrency(results.maxLimit);
        document.getElementById('normalCalculation').textContent = formatCurrency(results.normalCalculation);
        document.getElementById('maxLimitDetail').textContent = formatCurrency(results.maxLimit);
        document.getElementById('finalResult').textContent = formatCurrency(results.allocation);
        
        // Tüm potansiyel değerleri ve multiplier'ları göster
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
    
    // Sayı formatlama (1,000,000)
    function formatNumber(num) {
        return num.toLocaleString('tr-TR');
    }
    
    // Para formatlama ($1,234.56)
    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    
    // Sayfa yüklendiğinde örnek hesaplama
    setTimeout(() => {
        userBioXPInput.value = '100000';
        calculateAllocation();
    }, 500);
    
    // Input alanlarına focus olunduğunda placeholder'ı temizle
    userBioXPInput.addEventListener('focus', function() {
        if (this.value === '100000') {
            this.value = '';
        }
    });
    
    // Input alanlarından çıkıldığında boşsa örnek değeri geri koy
    userBioXPInput.addEventListener('blur', function() {
        if (!this.value) {
            this.value = '100000';
        }
    });
    
    // Range slider için tooltip benzeri gösterim
    totalPledgeSlider.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const value = this.min + (this.max - this.min) * percent;
        
        // Tooltip gösterme (opsiyonel)
        this.title = formatNumber(Math.round(value));
    });
    
    // Responsive tasarım için ek kontroller
    function handleResize() {
        if (window.innerWidth <= 768) {
            // Mobile optimizasyonları
            document.body.style.fontSize = '14px';
        } else {
            document.body.style.fontSize = '16px';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // İlk yükleme
});
