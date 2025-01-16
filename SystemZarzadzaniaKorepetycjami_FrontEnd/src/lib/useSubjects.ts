import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../futures/store';
import { updateToken } from '../futures/login/loginSlice';
import { useRefreshAccessToken } from './useRefreshAccessToken';
import { SubjectLevelDTO } from '../types/SubjectLevelDTO';
import { SubjectCategoryDTO } from '../types/SubjectCategoryDTO';

export const useAddSubject = () => {
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const addSubject = async (subjectName: string) => {
        setLoading(true);
        setError(null);
        let token = jwtToken;
        try {
            let response = await fetch(
                `http://localhost:5230/api/subject/addSubject`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(subjectName),
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        dispatch(updateToken(newToken));
                        token = newToken;
                        const retryResponse = await fetch(
                            `http://localhost:5230/api/subject/addSubject`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(subjectName),
                            }
                        );
                        setResponseStatus(retryResponse.status);
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                } else {
                    throw new Error(`Failed add subject, status: ${response.status}`);
                }
            } else {
                setResponseStatus(response.status);
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    return { addSubject, responseStatus, loading, error };
};

export const useAddSubjectCategory = () => {
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const addSubjectCategory = async (subjectCategoryDTO: SubjectCategoryDTO) => {
        setLoading(true);
        setError(null);
        let token = jwtToken;
        try {
            let response = await fetch(
                `http://localhost:5230/api/subjectCategory/addSubjectCategory`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(subjectCategoryDTO),
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        dispatch(updateToken(newToken));
                        token = newToken;
                        const retryResponse = await fetch(
                            `http://localhost:5230/api/subjectCategory/addSubjectCategory`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(subjectCategoryDTO),
                            }
                        );
                        setResponseStatus(retryResponse.status);
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                } else {
                    throw new Error(`Failed add subject, status: ${response.status}`);
                }
            } else {
                setResponseStatus(response.status);
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    return { addSubjectCategory, responseStatus, loading, error };
};

export const useAddSubjectLevel = () => {
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const addSubjectLevel = async (subjectLevelDTO: SubjectLevelDTO) => {
        setLoading(true);
        setError(null);
        let token = jwtToken;
        try {
            let response = await fetch(
                `http://localhost:5230/api/subjectLevel/addSubjectLevel`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(subjectLevelDTO),
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        dispatch(updateToken(newToken));
                        token = newToken;
                        const retryResponse = await fetch(
                            `http://localhost:5230/api/subjectLevel/addSubjectLevel`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify(subjectLevelDTO),
                            }
                        );
                        setResponseStatus(retryResponse.status);
                    } else {
                        throw new Error('Failed to refresh token');
                    }
                } else {
                    throw new Error(`Failed add subject, status: ${response.status}`);
                }
            } else {
                setResponseStatus(response.status);
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Unknown error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    return { addSubjectLevel, responseStatus, loading, error };
};

export const useSubjectDelete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const deleteSubject = async (name: string) => {
        setLoading(true);
        setError(null);

        try {
            let token = jwtToken;
            let response = await fetch(
                `http://localhost:5230/api/subject/${name}/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    token = newToken;
                    dispatch(updateToken(token));
                    response = await fetch(
                        `http://localhost:5230/api/subject/${name}/delete`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    throw new Error('Failed to refresh token');
                }
            }

            setLoading(false);
            return response.status;
        } catch (err: any) {
            setLoading(false);
            setError('Failed to delete person');
            return null;
        }
    };

    return { deleteSubject, loading, error };
};

export const useSubjectCategoryDelete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const deleteSubjectCategory = async (
        subjectCategoryDTO: SubjectCategoryDTO
    ) => {
        setLoading(true);
        setError(null);

        try {
            let token = jwtToken;
            let response = await fetch(
                `http://localhost:5230/api/subjectCategory/${subjectCategoryDTO.subjectName}/${subjectCategoryDTO.subjectCategoryName}/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    token = newToken;
                    dispatch(updateToken(token));
                    response = await fetch(
                        `http://localhost:5230/api/subjectCategory/${subjectCategoryDTO.subjectName}/${subjectCategoryDTO.subjectCategoryName}/delete`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    throw new Error('Failed to refresh token');
                }
            }

            setLoading(false);
            return response.status;
        } catch (err: any) {
            setLoading(false);
            setError('Failed to delete person');
            return null;
        }
    };

    return { deleteSubjectCategory, loading, error };
};

export const useSubjectLevelDelete = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const refreshAccessToken = useRefreshAccessToken();

    const deleteLevelCategory = async (subjectLevelDTO: SubjectLevelDTO) => {
        setLoading(true);
        setError(null);

        try {
            let token = jwtToken;
            let response = await fetch(
                `http://localhost:5230/api/subjectLevel/${subjectLevelDTO.subjectName}/${subjectLevelDTO.subjectCategoryName}/${subjectLevelDTO.subjectLevelName}/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    token = newToken;
                    dispatch(updateToken(token));
                    response = await fetch(
                        `http://localhost:5230/api/subjectLevel/${subjectLevelDTO.subjectName}/${subjectLevelDTO.subjectCategoryName}/${subjectLevelDTO.subjectLevelName}/delete`,
                        {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    throw new Error('Failed to refresh token');
                }
            }

            setLoading(false);
            return response.status;
        } catch (err: any) {
            setLoading(false);
            setError('Failed to delete person');
            return null;
        }
    };

    return { deleteLevelCategory, loading, error };
};
