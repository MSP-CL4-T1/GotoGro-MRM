import supabase from './supabaseClient';

export const signUp = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;

    return user;
};

export const signIn = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    return user;
};

export const search = async (name) => {
    try {
        let { data: Members, error } = await supabase
            .from('Members')
            .select('*')
            .or(`first_name.ilike.%${name}%,last_name.ilike.%${name}%`);

        if (error) throw error;

        return Members;
    } catch (error) {
        throw error;
    }
}
