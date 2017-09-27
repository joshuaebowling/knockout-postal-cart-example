var productData = [
    {
        title: 'Coffee',
        price: 14.95,
        available: 27,
        discountAfter: 6,
        certifications: ['USDA Organic', 'GMO Free', 'Fair Trade'],
        tags: ['Origin:Costa Rica', 'Descriptor:Light Roast', 'Flavor: Mild & Nutty'],
        rating: 10
    },
    {
        title: 'fruit leather',
        price: 0.5,
        available: 50,
        discountAfter: 6,
        certifications: ['USDA Organic', 'GMO Free'],
        tags: ['Origin:Costa Rica', 'Descriptor:Light Roast', 'Flavor: Mild & Nutty'],
        rating: 9
    },
    {
        title: 'mid-level fancy wine',
        price: 89.12,
        available: 13,
        discountAfter: 6,
        certifications: ['GMO Free'],
        tags: ['Origin:Italy', 'Grape:Chianti', 'Flavor: Floral + Smooth Finish'],
        rating: 6
    },
    {
        title: 'moon round trip ticket',
        price: 22450,
        available: 4,
        discountAfter: 6,
        certifications: ['GMO Free'],
        tags: ['Departs:Tomorrow', 'Returns:LOL, BC', 'Seating:Business Class'],
        rating: null
    },
    {
        title: 'champagne',
        price: 45,
        available: 7,
        discountAfter: 6,
        certifications: ['GMO Free'],
        tags: ['Origin:France', 'Grape:Buena Pregunta', 'Flavor: Bubbly'],
        rating: 6
        
    },
    {
        title: 'Pea Protein Powder',
        price: 14.95,
        available: 23,
        discountAfter: 6,
        certifications: ['USDA Organic', 'GMO Free'],
        tags: ['Buzz: Branched-Chain Amino Acids', 'Flavor:Meh', 'Recommender: Dr Feelgo Ood'],
        rating: 8
    },
    {
        title: 'Egg',
        price: 0.5,
        available: 500,
        discountAfter: 12,
        certifications: ['USDA Organic', 'GMO Free', 'Free Range'],
        tags: ['Origin:Local', 'Flavor: Chickeny'],
        rating: 9
    },
    {
        title: 'Ribeye',
        price: 50.12,
        available: 13,
        discountAfter: null,
        certifications: ['UDSA Organic', 'USDA Prime'],
        tags: ['Origin:Texas', 'Average Weight: 1 lb', 'Feed:Grass'],
        rating: 9
    },
    {
        title: 'Total Recall',
        price: 27450,
        available: NaN,
        discountAfter: null,
        certifications: ['APA'],
        tags: ['Name:Quaid', 'Muscles:Big', 'Seating:Mostly Running'],
        rating: 4
    },
    {
        title: 'Men\'s Multivitamin',
        price: 45,
        available: 18,
        discountAfter: 6,
        certifications: ['GMO Free', 'USDA Organic', 'Whole Food'],
        tags: ['Raw', 'Vegan', '44 Superfoods'],
        rating: 6
        
    },
    {
        title: 'Rye Berries',
        price: 14.95,
        available: 27,
        discountAfter: 6,
        certifications: ['USDA Organic', 'GMO Free', 'Fair Trade'],
        tags: ['Amount:1lb', 'Awesome Use:Mycology'],
        rating: 10
    },
    {
        title: 'Ketchup',
        price: 5,
        available: 24,
        discountAfter: 6,
        certifications: ['USDA Organic', 'GMO Free'],
        tags: ['Roma Tomatoes', 'Amount:8 oz', 'Color:Green'],
        rating: 9
    },
    {
        title: 'Cheddar Hoop',
        price: 87.12,
        available: 13,
        discountAfter: null,
        certifications: ['GMO Free', 'USDA Organic'],
        tags: ['Color:White', 'Origin:Wisconsin', 'Flavor:Sharp'],
        rating: 3
    },
    {
        title: 'Journey to Center of Earth in Time Machine',
        price: 22450,
        available: 3,
        discountAfter: 6,
        certifications: null,
        tags: ['Departs:Yesterday', 'Returns:Do you have to ask?', 'NO AC'],
        rating: null
    },
    {
        title: 'Pine Nuts',
        price: 17,
        available: 14,
        discountAfter: 6,
        certifications: ['GMO Free', 'USDA Organic'],
        tags: ['Origin:Washington State', 'Awesome Use: Hummus'],
        rating: 7
        
    }
    
];

module.exports = function() {
    return new Promise((resolve, reject) => resolve(productData));
}