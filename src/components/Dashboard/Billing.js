import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';

// Mock payment history data
const paymentHistory = [
  { id: 'txn_123', date: '01.05.2025', amount: '1990₽', plan: 'Профессиональный', status: 'Оплачено' },
  { id: 'txn_122', date: '01.04.2025', amount: '1990₽', plan: 'Профессиональный', status: 'Оплачено' },
  { id: 'txn_121', date: '01.03.2025', amount: '1990₽', plan: 'Профессиональный', status: 'Оплачено' }
];

const Billing = ({ minimal }) => {

  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 1 }} /> Billing
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Текущий план:</strong> Профессиональный
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Следующий платеж: 01.06.2025
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
            >
              Управление
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Billing
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Текущий план
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>
                Профессиональный
              </Typography>
              <Typography variant="h4" sx={{ mb: 2 }}>
                1990₽<Typography variant="caption" sx={{ ml: 0.5 }}>/мес</Typography>
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>Включает:</strong>
              </Typography>
              <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
                <li>Неограниченно вакансий</li>
                <li>AI-анализ резюме</li>
                <li>AI-интервью</li>
                <li>Интеграция с Zoom</li>
                <li>Приоритетная поддержка</li>
              </ul>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="outlined" color="primary">
                  Сменить план
                </Button>
                <Button variant="contained" color="primary">
                  Продлить
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                История платежей
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Дата</TableCell>
                      <TableCell>Сумма</TableCell>
                      <TableCell>План</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.plan}</TableCell>
                        <TableCell>{payment.status}</TableCell>
                        <TableCell>
                          <Button size="small">Счет</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" size="small">
                  Показать все
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Платежная информация
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                <strong>Способ оплаты:</strong> Банковская карта **** 4242
              </Typography>
              
              <Button variant="outlined" size="small">
                Изменить способ оплаты
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Billing;
