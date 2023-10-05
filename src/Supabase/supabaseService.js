import supabase from './supabaseClient';

export const signOut = async () => {
    await supabase.auth.signOut();
}

/**
 * Signs up a new user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise} A promise that resolves to the user or rejects with an error.
 */
export const signUp = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;

    return user;
};

/**
 * Signs in a user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise} A promise that resolves to the user or rejects with an error.
 */
export const signIn = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return user;
};

/**
 * Searches for members by name.
 * @param {string} name - The name to search for.
 * @returns {Promise} A promise that resolves to an array of members or rejects with an error.
 */
export const searchMembersByName = async (name) => {
    try {
        let { data: Members, error } = await supabase
            .from('Members')
            .select('*')
            .or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`);
        if (error) throw error;

        // Filter members based on your criteria
        const filteredMembers = Members.filter((member) => {
            if (!member.deleted) {
                // If not deleted, include the member
                return true;
            } else if (member.time_deleted) {
                // If deleted and time_deleted is available
                const timeDeleted = new Date(member.time_deleted); // Convert timestamp to Date
                const currentTime = new Date(); // Get current UTC time

                // Calculate the time difference in milliseconds
                const timeSinceDeletion = currentTime.getTime() - timeDeleted.getTime();

                const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
                return timeSinceDeletion <= twentyFourHoursInMilliseconds;
            }
            return false;
        });

        return filteredMembers;
    } catch (error) {
        throw error;
    }
};

/**
 * Updates a member's information.
 * @param {object} updatedMember - The updated member object.
 * @returns {Promise} A promise that resolves when the update is successful or rejects with an error.
 */
export const updateMember = async (updatedMember) => {
    try {
        const { error } = await supabase
            .from('Members')
            .update({
                // Specify the fields you want to update
                first_name: updatedMember.first_name,
                last_name: updatedMember.last_name,
                email: updatedMember.email
            })
            .eq('member_id', updatedMember.member_id); // Update based on member_id

        if (error) {
            throw error;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Soft deletes a member by setting the 'deleted' property to true.
 * @param {object} memberToDelete - The member to be deleted.
 * @returns {Promise} A promise that resolves when the deletion is successful or rejects with an error.
 */
export const softDeleteMember = async (memberToDelete) => {
    try {
        const { error } = await supabase
            .from('Members')
            .update({
                deleted: true,
                time_deleted: new Date()
            })
            .eq('member_id', memberToDelete.member_id);

        if (error) {
            throw error;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Retrieve deleted members by setting the 'deleted' property to false.
 * @param {object} memberToDelete - The member to be deleted.
 * @returns {Promise} A promise that resolves when the deletion is successful or rejects with an error.
 */
export const retrieveDeletedMember = async (memberToRetrieve) => {
    try {
        const { error } = await supabase
            .from('Members')
            .update({
                deleted: false,
                time_deleted: null
            })
            .eq('member_id', memberToRetrieve.member_id);

        if (error) {
            throw error;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Adds a new member to the database.
 *
 * @param {Object} newMember - The member object to be added.
 * @param {string} newMember.first_name - The first name of the member.
 * @param {string} newMember.last_name - The last name of the member.
 * @param {string} newMember.email - The email address of the member.
 * @param {string} newMember.date_joined - The date the member joined.
 * @throws {Error} Throws an error if there is any issue with the database operation.
 */
export const addMember = async (newMember) => {
    try {
        // Get the last ID from the table
        const { data: lastId } = await supabase
            .from('Members')
            .select('member_id')
            .order('member_id', { ascending: false })
            .limit(1);

        // Calculate the new ID by incrementing the last ID
        const newId = lastId[0]?.member_id + 1 || 1; // If no previous records, start from 1
        // Insert the new member into the database with the calculated ID
        const { error } = await supabase
            .from('Members')
            .insert([
                {
                    member_id: newId,
                    first_name: newMember.first_name,
                    last_name: newMember.last_name,
                    email: newMember.email,
                    date_joined: newMember.date_joined
                },
            ]);

        // Check for errors
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error adding member:', error.message);
        throw error;
    }
};

/**
 * Fetches sales records from the database within a specified date range.
 *
 * @param {string} startDate - The start date of the date range (optional).
 * @param {string} endDate - The end date of the date range (optional).
 * @returns {Array} An array of sales records that match the date range.
 * @throws {Error} Throws an error if there is any issue with the database operation.
 */
export const fetchSalesByDateRange = async (startDate, endDate) => {
    try {
        let query = supabase.from('SaleRecords').select('*');
        // If startDate is provided, add condition for dates greater than or equal to startDate
        if (startDate && startDate.trim() !== "") {
            query = query.gte('sale_date', startDate);
        }
        // If endDate is provided, add condition for dates less than or equal to endDate
        if (endDate && endDate.trim() !== "") {
            query = query.lte('sale_date', endDate);
        }
        const { data, error } = await query;

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error fetching sales: ", error);
        return [];
    }
};

/**
 * Fetches all products from the database.
 *
 * @returns {Array} An array of all products in the database.
 * @throws {Error} Throws an error if there is any issue with the database operation.
 */
export async function fetchProducts() {
    const { data, error } = await supabase.from('Products').select('*');

    if (error) throw error;

    return data;
}

export async function searchProductsByName(name) {
    try {
        let { data: products, error } = await supabase
            .from('Products')
            .select('*')
            .or(`product_name.ilike.%${name}%,description.ilike.%${name}%`);
        if (error) throw error;

        return products;
    } catch (error) {
        throw error;
    }
}

export async function addProduct(newProduct) {
    try {
        // Get the last ID from the table
        const { data: lastId } = await supabase
            .from('Products')
            .select('product_id')
            .order('product_id', { ascending: false })
            .limit(1);

        // Calculate the new ID by incrementing the last ID
        const newId = lastId[0]?.product_id + 1 || 1; // If no previous records, start from 1
        // Insert the new product into the database with the calculated ID
        const { error } = await supabase
            .from('Products')
            .insert([
                {
                    product_id: newId,
                    product_name: newProduct.product_name,
                    description: newProduct.description,
                    price: newProduct.price,
                    stock_quantity: newProduct.stock_quantity,
                    image: newProduct.image
                },
            ]);

        // Check for errors
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error adding product:', error.message);
        throw error;
    }
}