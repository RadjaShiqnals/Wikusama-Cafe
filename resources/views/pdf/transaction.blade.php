<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction PDF</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .header, .footer {
            text-align: center;
        }
        .details {
            margin-top: 20px;
        }
        .details th, .details td {
            padding: 8px;
            text-align: left;
        }
        .details th {
            background-color: #f2f2f2;
        }
        .thanks {
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $cafe_name }}</h1>
        <p>{{ $tgl_transaksi }}</p>
    </div>
    <div class="details">
        <p><strong>Nama Pelanggan:</strong> {{ $nama_pelanggan }}</p>
        <p><strong>Nomor Meja:</strong> {{ $nomor_meja }}</p>
        <table border="1" width="100%">
            <thead>
                <tr>
                    <th>Nama Menu</th>
                    <th>Harga</th>
                </tr>
            </thead>
            <tbody>
                @foreach($details as $detail)
                    <tr>
                        <td>{{ $detail->menuRelations->nama_menu }}</td>
                        <td>{{ $detail->harga }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="thanks">
        <p>{{ $thanks_message }}</p>
    </div>
</body>
</html>