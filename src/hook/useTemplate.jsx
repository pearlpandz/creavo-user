import {
    useQuery,
    QueryClient,
    useMutation
} from '@tanstack/react-query'
import { SETTINGS } from '../constants'

// Create a client
const queryClient = new QueryClient()

const fetchTemplates = async () => {
    const response = await fetch(`${SETTINGS.FRAME_SERVICE_URL}/api/frame/list`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data
}

export const useTemplate = () => {
    const { data: templates, isLoading } = useQuery({
        queryKey: ['templates'],
        queryFn: fetchTemplates
    })
    return {
        templates,
        isLoading,
    }
}

export const useTemplateById = (templateId) => {
    const { data: template, isLoading } = useQuery({
        queryKey: ['template', templateId],
        queryFn: async () => {
            const response = await fetch(`${SETTINGS.FRAME_SERVICE_URL}/api/frame/${templateId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json()
            return data
        },  
        enabled: !!templateId,
    })
    return {
        template,
        isLoading,
    }
}

const patchTemplate = async ({payload, id}) => {
    const response = await fetch(`${SETTINGS.FRAME_SERVICE_URL}/api/frame/update/${id}`, {
        method: 'PATCH',
        body: payload,
      });
    
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
    
      return response.json();
}

export const usePatchTemplate = () => {
    // Mutations
  const mutation = useMutation({
    mutationFn: patchTemplate,
    onSuccess: (data, variables) => {
        console.log(variables, data)
      queryClient.setQueryData(['template', variables._id], data);
    },
  })

  return mutation;
}

const createTemplate = async ({payload}) => {
    const response = await fetch(`${SETTINGS.FRAME_SERVICE_URL}/api/frame/create`, {
        method: 'POST',
        body: payload,
      });
    
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
    
      return response.json();
}

export const useCreateTemplate = () => {
    // Mutations
  const mutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: (data, variables) => {
        console.log(variables, data)
      queryClient.setQueryData(['template', variables._id], data);
    },
  })

  return mutation;
}