/**
 * Food: 10000 1000 500 100 50 10, monthly dissipation
 * Computers & Electronics: 500, 250, 100, 50, 10, 3 year dissipation
 * For computers, subsequent is easy - 
 * 1st is discounted by 50%, 2nd = 150/250, 3rd = 50/100 etc
 * 
 * For food, it's more complicated:
 * 1st becomes 9000 so 10%
 * 2nd becomes 500 so 50%
 * 3rd becomes 400 so 20%
 * 4th becomes 50 so 50%
 * 
 * So we have to keep the discounts for each subsequent unit.
 * The bigger the discount, the less the value of each next unit of the same type.
 * These discounts are sim-dependent and depend on profession, education, personality traits etc.
 * 
 * So, for each sim and for each type of goods we need to keep:
 * - weight that is multiplied by quality
 * - discounts for each subsequent unit
 * 
 * To model savings, we can give weight to saving certain amount of money
 * how do we model taking credit??
 */

// ok so sim profile with regards to goods / services is simply an array of this structure that has weights and discounts