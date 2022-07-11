import { useForm } from '@mantine/form';
import { showNotification } from "@mantine/notifications";
import { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../../app/constants';
import { Button, Group, Paper, Select, Stack, Text, Textarea } from "@mantine/core";

export default function({ pid }: {pid: string}) {

    const form = useForm({
        initialValues: {
          problem: '',
          code: '',
          language: ''
        },
      });

    useEffect(() => {
      axios.get(`${constants.SERVER_URL}/task`)
          .then((res: any) => setProblems(res.data.map((e: any) => e.name)))
          .catch(() => showNotification({
              color: 'red',
              title: 'Error',
              message: 'Could not load problems, please try again later'
          }))
    }, [pid]);

    const [problems, setProblems] = useState(['Loading...'])
    const [isCodePasted, setIsCodePasted] = useState(false);

    const exampleCode = `int main() {
    return 0;
}`

    return(
      <Paper p={12} sx={{
        width: '50%',
        '@media (max-width: 750px)': {
            width: '100%'
        }
    }}>
        <Stack>
            <Text size="xl">Submit solution</Text>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <Select
                    label="Problem"
                    data={problems}
                    placeholder="Problem Name"
                    required
                    {...form.getInputProps('problem')}
                />

                <Textarea
                    label="Code"
                    placeholder={exampleCode}
                    autosize
                    minRows={3}
                    mt={10}
                    onInput={(e: any) => {
                        if (e.currentTarget.value && e.currentTarget.value != '') setIsCodePasted(true);
                        else setIsCodePasted(false);
                    }} 
                    {...form.getInputProps('code')}/>

                <Select
                    label="Programming language"
                    data={['c++', 'javascript', 'python', 'rust']}
                    required={isCodePasted}
                    disabled={!isCodePasted}
                    mt={10}
                    {...form.getInputProps('language')}
                />

                <Group position="right"><Button type="submit" mt={10}>Submit</Button></Group>
            </form>
        </Stack>
    </Paper>
    )
}