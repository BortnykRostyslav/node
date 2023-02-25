function buildFilterQuery(query = {}){
    console.log(query);

    const filterQuery = {};
    const ageFilter = {};
    const dateFilter = {};

    if (query.age_gte){
        ageFilter.$gte = Number(query.age_gte);
    }

    if (query.age_lte){
        ageFilter.$lte = Number(query.age_lte);
    }

    if(query.date_gte){
        dateFilter.$gte = query.date_gte; //'2023-01-03'
    }

    if(query.date_lte){
        dateFilter.$lte = query.date_lte; //'2023-01-03'
    }

    if(query.search){
        filterQuery.$or = [
            { firsName: { $regex: query.search, $options: 'i' } },
            { lastName: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } }
        ];
    }

    if (Object.keys(ageFilter).length){
        filterQuery.age = ageFilter;
    }

    if (Object.keys(dateFilter).length){
        filterQuery.createdAt = dateFilter;
    }

    return filterQuery;
}

module.exports = {
    buildFilterQuery
};