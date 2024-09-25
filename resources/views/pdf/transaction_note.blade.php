<!DOCTYPE html>
<html>
<head>
    <title>Transaction Note</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            margin: 0 20px;
        }
        .details {
            margin-top: 20px;
        }
        .details table {
            width: 100%;
            border-collapse: collapse;
        }
        .details table, .details th, .details td {
            border: 1px solid black;
        }
        .details th, .details td {
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $cafe_name }}</h1>
        <p>Transaction Date: {{ $transaction_date }}</p>
        <p>Cashier: {{ $cashier_name }}</p>
    </div>
    <div class="content">
        <p>Meja: {{ $meja }}</p>
        <div class="details">
            <h2>Transaction Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Menu</th>
                        <th>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($details as $detail)
                        <tr>
                            <td>{{ $detail->menuRelations->nama_menu }}</td>
                            <td>{{ $detail->harga }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>