/**
 * GATHERLY — Authoritative Prize Pool Financial Planning Service
 * 
 * Core Financial Formulas:
 * 1. expectedRevenue = expectedRegistrations × registrationFee
 * 2. prizePool = expectedRevenue × (prizePoolPercentage / 100)
 * 3. organizerShare = expectedRevenue - prizePool
 * 
 * Strict Invariant:
 * prizePool + organizerShare === expectedRevenue
 * 
 * Business Constraints:
 * - Expected registrations represents organizer forecast (NOT total capacity spots)
 * - Maximum capacity is NOT used in the revenue formula
 * - Expected registrations must be a non-negative integer <= capacity (when capacity > 0)
 * - Registration fee must be a non-negative amount
 * - Prize pool percentage must be configurable between 70% and 80% inclusive (default 75%)
 * - Two decimal place monetary precision rounding
 */

const roundCurrency = (amount) => {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
};

/**
 * Validate financial inputs for an event
 */
const validateFinancialInputs = ({
  registrationFee = 0,
  expectedRegistrations = 0,
  capacity = null,
  prizePoolPercentage = 75,
}) => {
  const fee = Number(registrationFee);
  if (isNaN(fee) || fee < 0) {
    return {
      isValid: false,
      error: 'Registration fee must be a valid non-negative amount (₹)',
    };
  }

  const expReg = Number(expectedRegistrations);
  if (isNaN(expReg) || !Number.isInteger(expReg) || expReg < 0) {
    return {
      isValid: false,
      error: 'Expected registrations must be a valid non-negative integer',
    };
  }

  if (capacity !== null && capacity !== undefined) {
    const cap = Number(capacity);
    if (!isNaN(cap) && cap > 0 && expReg > cap) {
      return {
        isValid: false,
        error: `Expected registrations (${expReg}) cannot exceed maximum event capacity (${cap})`,
      };
    }
  }

  const pct = Number(prizePoolPercentage);
  if (isNaN(pct) || pct < 70 || pct > 80) {
    return {
      isValid: false,
      error: `Prize pool allocation percentage (${pct}%) must be configured between 70% and 80% inclusive`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Authoritative financial allocation calculator
 */
const calculateEventFinancials = ({
  registrationFee = 0,
  expectedRegistrations = 0,
  capacity = null,
  prizePoolPercentage = 75,
}) => {
  const validation = validateFinancialInputs({
    registrationFee,
    expectedRegistrations,
    capacity,
    prizePoolPercentage,
  });

  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const fee = roundCurrency(Number(registrationFee));
  const expReg = parseInt(expectedRegistrations, 10);
  const cap = capacity !== null && capacity !== undefined ? parseInt(capacity, 10) : null;
  const pct = Number(prizePoolPercentage);

  // Formula 1: Expected registration revenue based strictly on expected registrations (NOT capacity)
  const expectedRevenue = roundCurrency(expReg * fee);

  // Formula 2: Prize pool allocation (70% - 80%)
  const prizePool = roundCurrency(expectedRevenue * (pct / 100));

  // Formula 3: College / Organizing committee share
  const organizerShare = roundCurrency(expectedRevenue - prizePool);

  return {
    registrationFee: fee,
    expectedRegistrations: expReg,
    capacity: cap,
    prizePoolPercentage: pct,
    expectedRevenue,
    prizePool,
    organizerShare,
    // Backwards-compatible field aliases
    feePerParticipant: fee,
    maxSpots: cap || expReg,
    prizePoolAmount: prizePool,
    collegeAllocation: organizerShare,
    organizerAllocation: organizerShare,
  };
};

/**
 * Strip confidential financial allocation fields from public-facing representations
 */
const sanitizeInternalFinancials = (event) => {
  if (!event) return null;
  const raw = event.toObject ? event.toObject() : { ...event };
  
  delete raw.financialConfig;
  delete raw.expectedRevenue;
  delete raw.prizePool;
  delete raw.organizerShare;
  delete raw.prizePoolPercentage;
  delete raw.internalNotes;
  delete raw.budgetProposals;

  return raw;
};

module.exports = {
  roundCurrency,
  validateFinancialInputs,
  calculateEventFinancials,
  sanitizeInternalFinancials,
};
