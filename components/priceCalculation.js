export const calculatePrice = async (data) => {
    const { startDate, endDate, guests, addOns, hostId } = data;

    console.log("Start date unchanged:", startDate);
    console.log("End date unchanged:", endDate);

    console.log("Calculating price for data:", data);

    const response = await fetch(`/api/fetchPricingData?hostId=${hostId}`);
    if (!response.ok) {
        console.error('Failed to fetch host pricing data.');
        throw new Error('Failed to fetch host pricing data.');
    }
    const pricingSettings = await response.json();

    const startMs = startDate.getTime();
    let endMs = endDate.getTime();

    // Ensure endMs is ahead of startMs by adding 24 hours if needed
    if (endMs <= startMs) {
        endMs += 24 * 60 * 60 * 1000;
    }

    const durationHours = (endMs - startMs) / 36e5;
    console.log("Duration in hours:", durationHours);

    const { baseRateLateNight, baseRateWeekday, baseRateWeekendEvening, baseRateWeekendMorning, cleaningFee, extraGuestFee } = pricingSettings.pricing;

    if (!baseRateLateNight || !baseRateWeekday || !baseRateWeekendEvening || !baseRateWeekendMorning || !cleaningFee || !extraGuestFee) {
        throw new Error('Missing pricing data.');
    }

    const dayOfWeek = startDate.getDay();
    const startHour = startDate.getHours();
    
    console.log("Received pricing settings:", pricingSettings);

    let baseRateHourly = baseRateWeekday; // Default to weekday rate
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Weekend
        baseRateHourly = startHour < 17 ? baseRateWeekendMorning : (startHour >= 21 ? baseRateLateNight : baseRateWeekendEvening);
    }

    let totalBaseRate = 0;

    let ratePeriodDuration = Math.min(17 - startHour, durationHours); // Duration in the first rate period
    totalBaseRate += baseRateHourly * ratePeriodDuration;

    if (durationHours > ratePeriodDuration) {
        baseRateHourly = startHour < 17 ? baseRateWeekendMorning : (startHour >= 21 ? baseRateLateNight : baseRateWeekendEvening);
        ratePeriodDuration = durationHours - ratePeriodDuration; // Duration in the next rate period
        totalBaseRate += baseRateHourly * ratePeriodDuration;
    }

    const guestFeeRate = guests > 19 ? extraGuestFee.find(item => guests >= item.guestCount)?.additionalFeePerHour || 0 : 0;
    const cleaningFeeRate = guests > 19 ? cleaningFee.largeGroup : cleaningFee.standard;

    let addOnFees = 0;
    let breakdown = { baseRate: totalBaseRate, guestFee: guests > 19 ? (guests - 19) * guestFeeRate : 0, cleaningFee: cleaningFeeRate, addOns: {} };

    console.log("Breakdown before add-ons:", breakdown);

    if (addOns && typeof addOns === 'object') {
        Object.entries(addOns).forEach(([key, value]) => {
            if (value && pricingSettings.pricing.addOns[key]) {
                const addOnCost = pricingSettings.pricing.addOns[key] * (key === 'allInclusive' ? 1 : durationHours);
                addOnFees += addOnCost;
                breakdown.addOns[key] = addOnCost;
                console.log(`Add-on ${key}:`, addOnCost);
            }
        });
    }

    const totalCost = breakdown.baseRate + breakdown.guestFee + breakdown.cleaningFee + addOnFees;
    console.log("Final calculated cost:", totalCost);

    return {
        ...data,
        totalCost,
        breakdown
    };
};
